import { fakerDE } from "@faker-js/faker";
import dummyImages from "./dummyFiles/dummyfiles-index";
import { imageFactory } from "./factories/image.factory";
import { userFactory } from "./factories/user.factory";
import { designFactory } from "./factories/design.factory";
import { orderFactory } from "./factories/order.factory";
import { textElementFactory } from "./factories/texts.factory";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { initDb } from "src/db/db";

const selectRandomDummyImages = (amount: number): Buffer[] =>
  fakerDE.helpers.arrayElements(dummyImages, amount);

interface GenerateSingleUserInterface {
  imageAmount?: number;
  orderAmount?: number;
  designAmount?: number;
  textAmount?: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateSingleUser = async ({
  imageAmount,
  orderAmount,
  designAmount,
  textAmount,
}: GenerateSingleUserInterface): Promise<void> => {
  try {
    initDb(process.env.DATABASE_URL!);
    // Create User
    const { email, password, id } = await userFactory.insertSingleUser();
    console.log(email, password, id);
    fs.appendFileSync(
      path.join(__dirname, "dummyLoginDetails.txt"),
      `"email":"${email}","password":"${password}";`
    );
    // Upload 3 Images
    const randomImages: Buffer[] = selectRandomDummyImages(imageAmount ?? 3);
    const imageIds: number[] = [];
    for (const randomImage of randomImages) {
      const uuid = fakerDE.string.uuid();
      const imageId: number = await imageFactory.createSingleImageInsert(
        id!,
        randomImage,
        uuid
      );
      imageIds.push(imageId);

      await imageFactory.uploadSingleRandomDummyImage({
        userId: id!,
        image: randomImage,
        imageId: imageId,
        uuid,
      });
    }
    // Create 1 order
    const orderId: number = await orderFactory.insertSingleOrder(id!);

    for (let i = 0; i < (designAmount ?? 3); i++) {
      const designId: number = await designFactory.insertSingleDesign(
        orderId,
        id!
      );
      await imageFactory.placeImageOnDesign(
        fakerDE.helpers.arrayElement(imageIds),
        designId
      );
      if (fakerDE.number.int({ min: 1, max: 2 }) == 1) {
        await imageFactory.placeImageOnDesign(
          fakerDE.helpers.arrayElement(imageIds),
          designId
        );
      }

      for (let i = 0; i < (textAmount ?? 3); i++) {
        const textId: number = await textElementFactory.insertSingleText(
          designId
        );
        await textElementFactory.placeTextOnDesign(textId, designId);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

/*
Process:
  - Create user
  - Upload 3 images
  - Create 1 order
  - Create 3 designs (pick pullover)
  - For each design:
    - Connect 1 image to design
    - Create and connect 1-3 text elements
*/

generateSingleUser({});
generateSingleUser({});
