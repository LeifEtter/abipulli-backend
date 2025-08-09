import { eq, inArray } from "drizzle-orm";
import { getDb } from "../db";
import { InsertImage, pullovers, images, InsertPullover } from "../index";
import {
  PulloverDataWithFile,
  normalPullovers,
  heavyPullovers,
} from "./pullover-images";
import { uploadImageToHetzner } from "src/services/images/uploadImage.service";
import { randomUUID } from "crypto";
import imageSize from "image-size";

const insertPullover = async (
  pullover: PulloverDataWithFile
): Promise<void> => {
  const frontImageUUID = randomUUID();
  const frontDimensions = imageSize(pullover.fileFront);
  const backImageUUID = randomUUID();
  const backDimensions = imageSize(pullover.fileBack);

  try {
    await uploadImageToHetzner({
      file: pullover.fileFront,
      path: `${process.env.NODE_ENV}/general`,
      filename: `${frontImageUUID}`,
      imageType: "image/png",
    });
    const frontImageId: number = (
      await getDb()
        .insert(images)
        .values({
          file_uuid: frontImageUUID,
          generated: false,
          file_env: process.env.NODE_ENV,
          image_height: frontDimensions.height,
          image_width: frontDimensions.width,
        })
        .returning({ id: images.id })
    )[0]!.id;

    await uploadImageToHetzner({
      file: pullover.fileBack,
      path: `${process.env.NODE_ENV}/general`,
      filename: `${backImageUUID}`,
      imageType: "image/png",
    });
    const backImageId: number = (
      await getDb()
        .insert(images)
        .values({
          file_uuid: backImageUUID,
          generated: false,
          file_env: process.env.NODE_ENV,
          image_height: backDimensions.height,
          image_width: backDimensions.width,
        })
        .returning({ id: images.id })
    )[0]!.id;

    await getDb().insert(pullovers).values({
      name: pullover.name,
      description: pullover.description,
      base_price: pullover.base_price,
      color: pullover.color,
      front_image_id: frontImageId,
      back_image_id: backImageId,
    });
  } catch (error) {
    console.error(error);
  }
};

const insertAllPullovers = async () => {
  for (let pullover of normalPullovers) {
    await insertPullover(pullover);
  }
  for (let pullover of heavyPullovers) {
    await insertPullover(pullover);
  }
};

// const insertPulloverImages = async (): Promise<number[]> => {
//   await getDb()
//     .delete(images)
//     .where(inArray(images.id, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

//   const imageIds = await getDb()
//     .insert(images)
//     .values(pulloverImages)
//     .returning({ id: images.id });
//   return imageIds.map((image) => image.id);
// };

// async function insertPullovers() {
//   const imageIds: number[] = await insertPulloverImages();
//   await getDb().delete(pullovers);

//   ];
//   const insertedPullovers = await getDb()
//     .insert(pullovers)
//     .values(newPullovers)
//     .returning();
//   return insertedPullovers;
// }

export default insertAllPullovers;
