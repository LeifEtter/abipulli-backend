import sharp from "sharp";

type OutputFormat = "jpeg" | "png" | "webp" | "avif"; // choose what you serve

export async function normalizeToSDR(
  inputBuf: Buffer,
  fmt: OutputFormat = "webp" // pick your default output
) {
  const img = sharp(inputBuf, { unlimited: false }).toColorspace("srgb");
  switch (fmt) {
    case "jpeg":
      return await img
        .jpeg({
          quality: 82,
          chromaSubsampling: "4:2:0",
          progressive: true,
          mozjpeg: true,
        })
        .toBuffer();
    case "png":
      return await img
        .png({
          compressionLevel: 9,
          palette: false,
          adaptiveFiltering: true,
        })
        .toBuffer();
    case "webp":
      return await img
        .webp({
          quality: 82,
          nearLossless: false,
          effort: 4,
        })
        .toBuffer();
    case "avif":
      return await img
        .avif({
          quality: 48,
          chromaSubsampling: "4:2:0",
          effort: 4,
        })
        .toBuffer();
  }
}
