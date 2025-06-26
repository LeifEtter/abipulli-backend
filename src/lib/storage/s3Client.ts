import { S3Client } from "@aws-sdk/client-s3";
import { HETZNER_STORAGE } from "src/configs/hetzner.config";

const s3 = new S3Client({
  region: "eu-west-1",
  endpoint: HETZNER_STORAGE,
  credentials: {
    accessKeyId: process.env.HETZNER_ACCESS_KEY!,
    secretAccessKey: process.env.HETZNER_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export default s3;
