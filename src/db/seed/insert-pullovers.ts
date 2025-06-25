import { eq, inArray } from "drizzle-orm";
import db from "../db";
import { InsertImage, pullovers, images, InsertPullover } from "../index";
import pulloverData, { PulloverDataWithFile } from "./pullover-images";
import { uploadImageToHetzner } from "src/services/images/uploadImage.service";
import { randomUUID } from "crypto";
import imageSize from "image-size";

const insertPullover = async (
  pullover: PulloverDataWithFile
): Promise<void> => {
  const imageUUID = randomUUID();
  const dimensions = imageSize(pullover.file);

  try {
    await uploadImageToHetzner({
      file: pullover.file,
      path: `${process.env.NODE_ENV}/general`,
      filename: `${imageUUID}`,
      imageType: "image/png",
    });
    const imageId: number = (
      await db
        .insert(images)
        .values({
          file_uuid: imageUUID,
          generated: false,
          file_env: process.env.NODE_ENV,
          image_height: dimensions.height,
          image_width: dimensions.width,
        })
        .returning({ id: images.id })
    )[0]!.id;

    await db.insert(pullovers).values({
      name: pullover.name,
      description: pullover.description,
      base_price: pullover.base_price,
      color: pullover.color,
      image_id: imageId,
    });
  } catch (error) {
    console.error(error);
  }
};

const insertAllPullovers = async () => {
  for (let pullover of pulloverData) {
    await insertPullover(pullover);
  }
};

// const insertPulloverImages = async (): Promise<number[]> => {
//   await db
//     .delete(images)
//     .where(inArray(images.id, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

//   const imageIds = await db
//     .insert(images)
//     .values(pulloverImages)
//     .returning({ id: images.id });
//   return imageIds.map((image) => image.id);
// };

// async function insertPullovers() {
//   const imageIds: number[] = await insertPulloverImages();
//   await db.delete(pullovers);

//   ];
//   const insertedPullovers = await db
//     .insert(pullovers)
//     .values(newPullovers)
//     .returning();
//   return insertedPullovers;
// }

export default insertAllPullovers;
