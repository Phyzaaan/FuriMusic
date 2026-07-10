import play from 'play-dl';

let isConfigured = false;
export default async function getPlayDlInstance() {
    if (!isConfigured) {
        try {
            let rawCookies = process.env.YT_COOKIES;

            if (!rawCookies) {
                return play;
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