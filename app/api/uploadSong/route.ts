import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import path from "path";
import YTDlpWrap from "yt-dlp-wrap";
import { sanitizeName } from "@/app/utils/data/data";

const ytDlpWrap = new YTDlpWrap();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Compressor: Steps down quality until it fits the maxKB
async function compressImage(file: File, maxKB: number): Promise<Buffer> {
    const buffer = Buffer.from(await file.arrayBuffer());
    let quality = 80;
    let output = await sharp(buffer).jpeg({ quality }).toBuffer();

    while (output.length > maxKB * 1024 && quality > 10) {
        quality -= 10;
        output = await sharp(buffer).jpeg({ quality }).toBuffer();
    }
    return output;
}

// Downloader: Streams the YouTube audio directly into memory using play-dl
async function fetchMp3(url: string): Promise<{ buffer: Buffer; mimeType: string; ext: string }> {
    try {
        const cookieFilePath = path.join(process.cwd(), 'app/api/cookies/yt-cookies.txt');

        const args = [
            url,
            "-f", "bestaudio[ext=webm]",
            "-o", "-",
            "--js-runtimes", "node",
            "--cookies", cookieFilePath
        ];

        const sourceStream = ytDlpWrap.execStream(args);

        const mimeType = "audio/webm; codecs=opus";
        const ext = "webm";

        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];

            sourceStream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
            sourceStream.on("end", () => resolve({ buffer: Buffer.concat(chunks), mimeType, ext }));
            sourceStream.on("error", (err) => reject(err));
        });
    } catch (error) {
        throw new Error(`Failed to stream with yt-dlp-wrap: ${error}`);
    }
}


// Uploader: Pushes buffers to Supabase and returns the public URL
async function uploadToSupabase(bucket: string, path: string, buffer: Buffer, contentType: string) {
    const { error } = await supabase.storage.from(bucket).upload(path, buffer, { contentType, upsert: true });
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

        const songBannerFile = formData.get("banner") as File | null;
        const pendingMeta: string[] = JSON.parse((formData.get("pendingArtistsMeta") as string) || "[]");

        const safeName = sanitizeName(name);

        // --- PROCESS UPLOADS ---

        // Song Banner
        let songBannerUrl: string | null = null;
        if (songBannerFile) {
            const compressedBanner = await compressImage(songBannerFile, 150);
            songBannerUrl = await uploadToSupabase("songsBanner", `${safeName}.jpg`, compressedBanner, "image/jpeg");
        }

        // Pending Artist Banners
        const newArtistsData: { name: string, banner: string | null }[] = await Promise.all(pendingMeta.map(async (artistName, idx: number) => {
            const artistFile = formData.get(`pendingArtistBanner_${idx}`) as File | null;
            let bannerUrl = null;
            if (artistFile) {
                const compressedArtist = await compressImage(artistFile, 100);
                const safeArtist = sanitizeName(artistName);
                bannerUrl = await uploadToSupabase("artistsBanner", `${safeArtist}.jpg`, compressedArtist, "image/jpeg");
            }
            return { name: artistName, banner: bannerUrl };
        }));

        // Fetch and Upload MP3
        const mp3 = await fetchMp3(url);
        const mp3Url = await uploadToSupabase("songs", `${safeName}.${mp3.ext}`, mp3.buffer, mp3.mimeType);

        // --- DB INSERTION ---
        const suggestionPayload = {
            name,
            duration,
            lyrics,
            url: mp3Url,
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