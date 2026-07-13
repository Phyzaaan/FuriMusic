import { NextResponse } from "next/server";
import getVideoId from "@/app/utils/libs/getVideoId";
import { songDetails } from "@/app/utils/data/type";
import supabase from "@/app/utils/supabase/server";
import { headers } from "next/headers";

const API_KEY = process.env.YOUTUBE_API_KEY!;
const RATE_LIMIT_MS = 60_000;

function parseDuration(duration: string) {
    const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);

    const minutes = Number(match?.[1] ?? 0);
    const seconds = Number(match?.[2] ?? 0);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type Thumbnail = {
    url: string;
    width?: number;
    height?: number;
};

type Thumbnails = {
    default?: Thumbnail;
    medium?: Thumbnail;
    high?: Thumbnail;
    standard?: Thumbnail;
    maxres?: Thumbnail;
};

function getBestThumbnail(thumbnails: Thumbnails) {
    return (
        thumbnails.maxres?.url ??
        thumbnails.standard?.url ??
        thumbnails.high?.url ??
        thumbnails.medium?.url ??
        thumbnails.default?.url ??
        ""
    );
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

        const { url } = await req.json();
        const videoId = getVideoId(url);

        if (!videoId) {
            return NextResponse.json(
                { error: "Invalid YouTube URL" },
                { status: 400 }
            );
        }

        const oneMinuteAgo = new Date(Date.now() - RATE_LIMIT_MS).toISOString();

        const { data: logData } = await supabase
            .from("request_log")
            .select("ip, yt_id")
            .gte("created_at", oneMinuteAgo);

        if (logData) {
            const duplicateVideo = logData.some(x => x.yt_id === videoId);
            const rateLimited = logData.some(x => x.ip === ip);

            if (duplicateVideo) {
                return NextResponse.json({ error: "Video is Already Submitted!" }, { status: 400 });
            } else if (rateLimited) {
                return NextResponse.json({ error: "Please wait one minute before suggesting another song." }, { status: 400 });
            }
        }

        // Video details
        const videoRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`
        );

        const videoJson = await videoRes.json();

        const video = videoJson.items?.[0];

        if (!video) {
            return NextResponse.json(
                { error: "Video not found" },
                { status: 404 }
            );
        }

        const duration = parseDuration(video.contentDetails.duration);
        if (+duration.split(":")[0] > 6) {
            return NextResponse.json(
                { error: "Video exceeds maximum supported duration." },
                { status: 400 }
            );
        }

        // Channel details
        const channelRes = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${video.snippet.channelId}&key=${API_KEY}`
        );

        const channelJson = await channelRes.json();

        const channel = channelJson.items?.[0];

        const data: songDetails = {
            name: video.snippet.title,
            banner: getBestThumbnail(video.snippet.thumbnails),
            url,
            duration: duration,
            artist_name: video.snippet.channelTitle,
            artist_banner: getBestThumbnail(channel?.snippet?.thumbnails ?? {})
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);

        return NextResponse.json({ error: "Failed to fetch video details" }, { status: 500 });
    }
}