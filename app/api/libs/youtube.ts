import play from 'play-dl';
import fs from "fs";
import path from "path";

let isConfigured = false;

export default async function getPlayDlInstance() {
    if (!isConfigured) {
        try {
            const cookiePath = path.join(process.cwd(), 'app/api/cookies/yt-cookies.txt');
            let rawCookies = fs.readFileSync(cookiePath, 'utf-8');

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