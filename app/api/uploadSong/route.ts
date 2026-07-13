import { NextResponse } from "next/server";
import { sanitizeName } from "@/app/utils/data/data";
import { compressImage } from "@/app/utils/libs/compressImage";
import { headers } from "next/headers";
import supabase from "@/app/utils/supabase/server";

async function uploadToSupabase(bucket: string, path: string, file: File) {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw new Error(`Upload failed for ${path}: ${error.message}`);
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function POST(req: Request) {
    try {
        const headersList = await headers();

        const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim();

        if (!ip) {
            return NextResponse.json(
                { error: "Failed to validate your request. Please try again!" },
                { status: 400 }
            );
        }

        const formData = await req.formData();
        const videoId = formData.get("videoId") as string;

        const name = formData.get("name") as string;
        const url = formData.get("url") as string;
        const duration = formData.get("duration") as string;
        const lyrics = formData.get("lyrics") as string;
        const existingArtistsIds: number[] = JSON.parse((formData.get("existingArtistsIds") as string) || "[]");

        const songBanner = formData.get("banner") as File | string | null;
        const pendingMeta: string[] = JSON.parse((formData.get("pendingArtistsMeta") as string) || "[]");

        const safeName = sanitizeName(name);

        // --- PROCESS UPLOADS ---

        // Song Banner
        let songBannerUrl: string | null = null;
        if (songBanner) {
            const bannerFile = await compressImage(songBanner, 250);
            songBannerUrl = await uploadToSupabase("songsBanner", `${safeName}.jpg`, bannerFile);
        }

        // Pending Artist Banners
        const newArtistsData: { name: string, banner: string | null }[] = await Promise.all(pendingMeta.map(async (artistName, idx: number) => {
            const artistFile = formData.get(`pendingArtistBanner_${idx}`) as File | null;
            let bannerUrl: string | null = null;
            if (artistFile) {
                const safeArtist = sanitizeName(artistName);
                bannerUrl = await uploadToSupabase("artistsBanner", `${safeArtist}.jpg`, artistFile);
            }
            return { name: artistName, banner: bannerUrl };

        }));

        // --- DB INSERTION ---
        const suggestionPayload = {
            name,
            duration,
            lyrics,
            url: url,
            banner: songBannerUrl,
            existing_artists: existingArtistsIds,
            new_artists: newArtistsData
        };

        const { error: dbError } = await supabase.from("Suggestions").insert(suggestionPayload);
        if (dbError) throw new Error(dbError.message);

        const log = { yt_id: videoId, ip };
        const { error } = await supabase.from("request_log").insert(log);

        if (error) {
            console.error(error);
            return NextResponse.json({ error: "Unable to submit your suggestion. Please try again." }, { status: 500 });
        }

        return NextResponse.json({ message: "Suggestion queued successfully!" }, { status: 200 });

    } catch (error) {
        console.error("Processing failed:", error);
        return NextResponse.json({ error: error || "Failed to process request" }, { status: 500 });
    }
}