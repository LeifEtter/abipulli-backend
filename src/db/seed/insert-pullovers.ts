import { eq, inArray } from "drizzle-orm";
import db from "../db";
import { InsertImage, pullovers, images, InsertPullover } from "../index";

const insertPulloverImages = async () => {
  await db
    .delete(images)
    .where(inArray(images.id, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
  const pulloverImages: InsertImage[] = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
  ];
  await db.insert(images).values(pulloverImages);
};

async function insertPullovers() {
  await insertPulloverImages();
  await db.delete(pullovers);

  const newPullovers: InsertPullover[] = [
    {
      name: "Heavy Oversized Schwarz",
      description: "Schwarzer Heavy 100% Wolle Oversized Pullover",
      base_price: 50,
      color: "schwarz",
      image_id: 1,
      hoodie: false,
    },
    {
      name: "Heavy Oversized Grau",
      description: "Grauer Heavy 100% Wolle Oversized Pullover",
      base_price: 50,
      color: "grau",
      image_id: 2,
      hoodie: false,
    },
    {
      name: "Heavy Oversized Dunkelgrün",
      description: "Dunkelgrüner Heavy 100% Wolle Oversized Pullover",
      base_price: 50,
      color: "dunkelgrün",
      image_id: 3,
      hoodie: false,
    },
    {
      name: "Heavy Oversized Hoodie Schwarz",
      description: "Schwarzer Heavy 100% Wolle Oversized Hoodie",
      base_price: 50,
      color: "schwarz",
      image_id: 4,
      hoodie: true,
    },
    {
      name: "Heavy Oversized Hoodie Grau",
      description: "Grauer Heavy 100% Wolle Oversized Hoodie",
      base_price: 50,
      color: "grau",
      image_id: 5,
      hoodie: true,
    },
    {
      name: "Heavy Oversized Hoodie Dunkelgrün",
      description: "Dunkelgrüner Heavy 100% Wolle Oversized Hoodie",
      base_price: 50,
      color: "dunkelgrün",
      image_id: 6,
      hoodie: true,
    },
    {
      name: "Pullover Slim Fit Schwarz",
      description: "Schwarzer Slim Fit 100% Wolle Pullover",
      base_price: 35,
      color: "schwarz",
      image_id: 7,
      hoodie: false,
    },
    {
      name: "Pullover Slim Fit Grau",
      description: "Grauer Slim Fit 100% Wolle Pullover",
      base_price: 35,
      color: "grau",
      image_id: 8,
      hoodie: false,
    },
    {
      name: "Pullover Slim Fit Dunkelgrün",
      description: "Dunkelgrüner Slim Fit 100% Wolle Pullover",
      base_price: 35,
      color: "dunkelgrün",
      image_id: 9,
      hoodie: false,
    },
    {
      name: "Pullover Slim Fit Rot",
      description: "Roter Slim Fit 100% Wolle Pullover",
      base_price: 35,
      color: "rot",
      image_id: 10,
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
