import { NextResponse } from "next/server";
import { Innertube } from "youtubei.js";
import getVideoId from "@/app/utils/libs/getVideoId";

import formatTime from "@/app/utils/libs/formatTime";
import { songDetails } from "@/app/utils/data/type";

let youtube: Innertube | null = null;

type Thumbnail = {
    url: string;
    width: number;
    height: number;
}
async function getYoutube() {
    if (!youtube) {
        youtube = await Innertube.create();
    }

    return youtube;
}
function getBestBanner(thumbnail: Thumbnail[]) {
    return thumbnail.reduce((best, current) =>
            (current.width ?? 0) * (current.height ?? 0) >
                (best.width ?? 0) * (best.height ?? 0)
                ? current
                : best
        ).url;
}

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        const videoId = getVideoId(url);

        if (!url || !videoId) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        const yt = await getYoutube();
        const info = await yt.getInfo(videoId);
        const details = info.basic_info;
        console.log(JSON.stringify(details, null, 2));
        const channel = await yt.getChannel(details.channel!.id);

        const data: songDetails = {
            name: details.title ?? "youtube_track",
            banner: getBestBanner(details.thumbnail ?? []) ?? "",
            url: details.url_canonical ?? url,
            duration: formatTime(details.duration ?? 0),
            artist_name: details.channel?.name ?? "",
            artist_banner: getBestBanner(channel.metadata.thumbnail ?? []) ?? ""
        };

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Processing failed:", error);

        return NextResponse.json(
            { error: "Failed to process audio/images" },
            { status: 500 }
        );
    }
}