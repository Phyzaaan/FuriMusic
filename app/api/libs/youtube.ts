import play from 'play-dl';
import fs from "fs";
import path from "path";

let isConfigured = false;
export default async function getPlayDlInstance() {
    if (!isConfigured) {
        try {
            let rawCookies = '';

            // Load cookies from Vercel env or fallback to local file
            if (process.env.VERCEL && process.env.YT_COOKIES) {
                rawCookies = process.env.YT_COOKIES;
            } else {
                const cookiePath = path.join(process.cwd(), 'app/api/cookies/yt-cookies.txt');
                if (fs.existsSync(cookiePath)) {
                    rawCookies = fs.readFileSync(cookiePath, 'utf-8');
                } else {
                    throw new Error("Cookies file not found locally, and YT_COOKIES env is missing.");
                }
            }

            // Parse the Netscape format into a standard cookie string
            if (rawCookies.includes('# Netscape HTTP Cookie File')) {
                rawCookies = rawCookies
                    .split('\n')
                    .filter(line => line.trim() && !line.startsWith('#'))
                    .map(line => {
                        const parts = line.split('\t');
                        return parts.length >= 7 ? `${parts[5].trim()}=${parts[6].trim()}` : null;
                    })
                    .filter(Boolean)
                    .join('; ');
            }

            // Apply the token
            await play.setToken({
                youtube: {
                    cookie: rawCookies.trim()
                }
            });

            isConfigured = true;
        } catch (error) {
            console.error("❌ Failed to initialize play-dl tokens:", error);
            throw error;
        }
    }
    return play;
}