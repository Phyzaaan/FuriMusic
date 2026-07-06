import { NextResponse } from "next/server";
import { YouTubeVideo } from "play-dl";
import formatTime from "@/app/utils/libs/formatTime";
import sharp from "sharp";
import { songDetails } from "@/app/utils/data/type";
import getPlayDlInstance from "../libs/youtube";

export async function compressImage(
    url: string,
    maxKb: number,
): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
            console.warn(`Failed to fetch image: ${res.status} ${res.statusText}`);
            return url;
        }

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let quality = 80;
        let compressed = await sharp(buffer).jpeg({ quality }).toBuffer();

        // Optimized compression loop
        while (compressed.length > maxKb * 1024 && quality > 10) {
            quality -= 10;
            compressed = await sharp(buffer).jpeg({ quality }).toBuffer();
        }

        return `data:image/jpeg;base64,${compressed.toString('base64')}`;
    } catch (error) {
        clearTimeout(timeoutId);
        console.error("Image compression failed, returning original URL:", error);
        return url;
    }
}

export async function POST(req: Request) {
    try {
        const play = await getPlayDlInstance();
        const { url } = await req.json();
        if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

        const songDetails: songDetails = {
            name: "",
            banner: "",
            url: "",
            duration: "",
            artist_name: "",
            artist_banner: ""
        }

        const urlType = await play.validate(url);
        // Youtube
        if (urlType === "yt_video") {
            const videoInfo = await play.video_info(url);
            const details = videoInfo.video_details as YouTubeVideo;

            songDetails.name = details.title ?? "youtube_track";
            songDetails.duration = formatTime(details.durationInSec);

            songDetails.url = details.url;

            const songBannerUrl = details.thumbnails[details.thumbnails.length - 1]?.url ?? "";
            songDetails.banner = await compressImage(songBannerUrl, 150);

            songDetails.artist_name = details.channel?.name ?? "";

            const artistBannerUrl = details.channel?.icons?.[details.channel?.icons?.length - 1]?.url ?? "";
            songDetails.artist_banner = await compressImage(artistBannerUrl, 100);
        }

        return NextResponse.json(songDetails, { status: 200 });
    } catch (error) {
        console.error("Processing failed:", error);
        return NextResponse.json({ error: "Failed to process audio/images" }, { status: 500 });
    }
}