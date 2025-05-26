import { eq, inArray } from "drizzle-orm";
import db from "../db";
import { InsertImage, pullovers, images, InsertPullover } from "../index";

const insertPulloverImages = async (): Promise<number[]> => {
  await db
    .delete(images)
    .where(inArray(images.id, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
  const pulloverImages: InsertImage[] = [
    { file_uuid: "5C66855C-22F1-4154-803C-AA661255B95B" },
    { file_uuid: "1351F9D9-A665-4E9A-844F-2DACBF376217" },
    { file_uuid: "387B9A6F-483C-4C19-92E0-7431A8F3AED0" },
    { file_uuid: "98A64B9B-F5B3-45BE-B7A2-CE7354BD72F0" },
    { file_uuid: "EC20B316-D550-4FDD-AAFD-04EF4336EFD6" },
    { file_uuid: "317B927F-E7F8-4BEA-9FE2-E1CCEF3B3DD5" },
    { file_uuid: "262E9EA3-3851-4815-9A6D-187B1924809B" },
    { file_uuid: "EF60AD66-2C59-4F13-B5AB-E424D9914A1A" },
    { file_uuid: "70125171-7805-40B1-95C0-E9DBFE2FD511" },
    { file_uuid: "347FEEEB-FB16-4F45-A600-1ED55F649212" },
  ];

  const imageIds = await db
    .insert(images)
    .values(pulloverImages)
    .returning({ id: images.id });
  return imageIds.map((image) => image.id);
};

async function insertPullovers() {
  const imageIds: number[] = await insertPulloverImages();
  await db.delete(pullovers);

  const newPullovers: InsertPullover[] = [
    {
      name: "Heavy Oversized Schwarz",
      description: "Schwarzer Heavy 100% Wolle Oversized Pullover",
      base_price: 50,
      color: "schwarz",
      image_id: imageIds[0]!,
      hoodie: false,
    },
    {
      name: "Heavy Oversized Grau",
      description: "Grauer Heavy 100% Wolle Oversized Pullover",
      base_price: 50,
      color: "grau",
      image_id: imageIds[1]!,
      hoodie: false,
    },
    {
      name: "Heavy Oversized Dunkelgrün",
      description: "Dunkelgrüner Heavy 100% Wolle Oversized Pullover",
      base_price: 50,
      color: "dunkelgrün",
      image_id: imageIds[2]!,
      hoodie: false,
    },
    {
      name: "Heavy Oversized Hoodie Schwarz",
      description: "Schwarzer Heavy 100% Wolle Oversized Hoodie",
      base_price: 50,
      color: "schwarz",
      image_id: imageIds[3]!,
      hoodie: true,
    },
    {
      name: "Heavy Oversized Hoodie Grau",
      description: "Grauer Heavy 100% Wolle Oversized Hoodie",
      base_price: 50,
      color: "grau",
      image_id: imageIds[4]!,
      hoodie: true,
    },
    {
      name: "Heavy Oversized Hoodie Dunkelgrün",
      description: "Dunkelgrüner Heavy 100% Wolle Oversized Hoodie",
      base_price: 50,
      color: "dunkelgrün",
      image_id: imageIds[5]!,
      hoodie: true,
    },
    {
      name: "Pullover Slim Fit Schwarz",
      description: "Schwarzer Slim Fit 100% Wolle Pullover",
      base_price: 35,
      color: "schwarz",
      image_id: imageIds[6]!,
      hoodie: false,
    },
    {
      name: "Pullover Slim Fit Grau",
      description: "Grauer Slim Fit 100% Wolle Pullover",
      base_price: 35,
      color: "grau",
      image_id: imageIds[7]!,
      hoodie: false,
    },
    {
      name: "Pullover Slim Fit Dunkelgrün",
      description: "Dunkelgrüner Slim Fit 100% Wolle Pullover",
      base_price: 35,
      color: "dunkelgrün",
      image_id: imageIds[8]!,
      hoodie: false,
    },
    {
      name: "Pullover Slim Fit Rot",
      description: "Roter Slim Fit 100% Wolle Pullover",
      base_price: 35,
      color: "rot",
      image_id: imageIds[9]!,
      hoodie: false,
    },
  ];
  const insertedPullovers = await db
    .insert(pullovers)
    .values(newPullovers)
    .returning();
  return insertedPullovers;
}

export default insertPullovers;
