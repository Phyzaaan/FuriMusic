import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sanitizeName } from "@/app/utils/data/data";
import { compressImage } from "@/app/utils/libs/compressImage";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function uploadToSupabase(bucket: string, path: string, file: File) {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw new Error(`Upload failed for ${path}: ${error.message}`);
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

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
            let bannerUrl = null;
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

        return NextResponse.json({ message: "Suggestion queued successfully!" }, { status: 200 });

    } catch (error) {
        console.error("Processing failed:", error);
        return NextResponse.json({ error: error || "Failed to process request" }, { status: 500 });
    }
}