import { fakerDE } from "@faker-js/faker";
import { images, imageToDesign } from "src/db";
import db from "src/db/db";
import { uploadImageToHetzner } from "src/services/images/uploadImage.service";

interface uploadSingleImageInterface {
  userId: number;
  image: Buffer;
  imageId: number;
  uuid: string;
}

export interface ImageFactory {
  createSingleImageInsert: (
    userId: number,
    image: Buffer,
    uuid: string
  ) => Promise<number>;
  uploadSingleRandomDummyImage: (
    args: uploadSingleImageInterface
  ) => Promise<boolean>;
  placeImageOnDesign: (imageId: number, designId: number) => Promise<void>;
}

const createSingleImageInsert = async (
  userId: number,
  image: Buffer,
  uuid: string
): Promise<number> => {
  const insertedImageId = await db
    .insert(images)
    .values({
      file_size: Math.floor(image.length / 1024),
      prompt: "random prompt",
      user_id: userId,
      file_uuid: uuid,
    })
    .returning({ id: images.id });

  return insertedImageId[0]!.id;
};

const uploadSingleRandomDummyImage = async ({
  userId,
  image,
  imageId,
  uuid,
}: uploadSingleImageInterface): Promise<boolean> => {
  if (image) {
    await uploadImageToHetzner({
      file: image,
      path: `${process.env.NODE_ENV}/users/${userId}`,
      filename: `${uuid}`,
      imageType: "image/png",
    });
    return true;
  }
  return false;
};

const placeImageOnDesign = async (imageId: number, designId: number) => {
  await db.insert(imageToDesign).values({
    image_id: imageId,
    design_id: designId,
    x_position: fakerDE.number.int({ min: 0, max: 1000 }),
    y_position: fakerDE.number.int({ min: 0, max: 1000 }),
  });
};

export const imageFactory: ImageFactory = {
  createSingleImageInsert,
  uploadSingleRandomDummyImage,
  placeImageOnDesign,
};
