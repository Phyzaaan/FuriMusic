import sharp from "sharp";

export async function compressImage(
    input: string | File,
    maxKb: number
): Promise<File> {
    let buffer: Buffer;

    if (typeof input === "string") {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            const res = await fetch(input, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!res.ok) {
                throw new Error(`Failed to fetch image: ${res.status}`);
            }

            const arrayBuffer = await res.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        } finally {
            clearTimeout(timeoutId);
        }
    } else {
        const arrayBuffer = await input.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
    }

    let quality = 80;
    let compressed = await sharp(buffer).jpeg({ quality }).toBuffer();

    while (compressed.length > maxKb * 1024 && quality > 10) {
        quality -= 10;
        compressed = await sharp(compressed)
            .jpeg({ quality })
            .toBuffer();
    }

    return new File(
        [new Uint8Array(compressed)],
        typeof input === "string"
            ? "compressed.jpg"
            : input.name.replace(/\.[^.]+$/, ".jpg"),
        {
            type: "image/jpeg",
            lastModified: Date.now(),
        }
    );
}