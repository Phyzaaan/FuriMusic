import { NextResponse } from "next/server";
import { YouTubeVideo } from "play-dl";
import formatTime from "@/app/utils/libs/formatTime";
import { songDetails } from "@/app/utils/data/type";
import getPlayDlInstance from "../libs/play";

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

            songDetails.banner = details.thumbnails[details.thumbnails.length - 1]?.url ?? "";

            songDetails.artist_name = details.channel?.name ?? "";

            songDetails.artist_banner = details.channel?.icons?.[details.channel?.icons?.length - 1]?.url ?? "";
        }

        return NextResponse.json(songDetails, { status: 200 });
    } catch (error) {
        console.error("Processing failed:", error);
        return NextResponse.json({ error: "Failed to process audio/images" }, { status: 500 });
    }
}