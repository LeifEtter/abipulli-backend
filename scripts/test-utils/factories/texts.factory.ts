import { fakerDE } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { InsertOrder, orders, textElements } from "src/db";
import { getDb } from "src/db/db";

export interface TextElementFactory {
  insertSingleText: (designId: number) => Promise<number>;
  placeTextOnDesign: (textId: number, designId: number) => Promise<void>;
}

const fontFamilies = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Verdana",
];

const insertSingleText = async (designId: number): Promise<number> => {
  const textId = await db
    .insert(textElements)
    .values({
      design_id: designId,
      content: fakerDE.lorem.words(2),
      position_x: fakerDE.number.int({ min: 0, max: 1000 }),
      position_y: fakerDE.number.int({ min: 0, max: 1000 }),
      // font_size: fakerDE.number.int({ min: 10, max: 100 }),
      // font_color: fakerDE.color.rgb(),
      // font_family: fakerDE.helpers.arrayElement(fontFamilies),
    })
    .returning({ id: textElements.id });

  return textId[0]!.id!;
};

const placeTextOnDesign = async (
  textId: number,
  designId: number
): Promise<void> => {
  await db
    .update(textElements)
    .set({ design_id: designId })
    .where(eq(textElements.id, textId));
};

export const textElementFactory: TextElementFactory = {
  insertSingleText,
  placeTextOnDesign,
};
