import { fakerDE } from "@faker-js/faker";
import dummyImages from "./dummyFiles/dummyfiles-index";
import { imageFactory } from "./factories/image.factory";
import { userFactory } from "./factories/user.factory";
import { designFactory } from "./factories/design.factory";
import { orderFactory } from "./factories/order.factory";
import { textElementFactory } from "./factories/texts.factory";

const selectRandomDummyImages = (amount: number): Buffer[] =>
  fakerDE.helpers.arrayElements(dummyImages, amount);

interface GenerateSingleUserInterface {
  imageAmount?: number;
  orderAmount?: number;
  designAmount?: number;
  textAmount?: number;
}

const generateSingleUser = async ({
  imageAmount,
  orderAmount,
  designAmount,
  textAmount,
}: GenerateSingleUserInterface): Promise<void> => {
  try {
    // Create User
    const userId: number = await userFactory.insertSingleUser();

    // Upload 3 Images
    const randomImages: Buffer[] = selectRandomDummyImages(imageAmount ?? 3);
    const imageIds: number[] = [];
    for (const randomImage of randomImages) {
      const uuid = fakerDE.string.uuid();
      const imageId: number = await imageFactory.createSingleImageInsert(
        userId,
        randomImage,
        uuid
      );
      imageIds.push(imageId);

      await imageFactory.uploadSingleRandomDummyImage({
        userId: userId,
        image: randomImage,
        imageId: imageId,
        uuid,
      });
    }
    // Create 1 order
    const orderId: number = await orderFactory.insertSingleOrder(userId);

    for (let i = 0; i < (designAmount ?? 3); i++) {
      const designId: number = await designFactory.insertSingleDesign(
        orderId,
        userId
      );
      await imageFactory.placeImageOnDesign(
        fakerDE.helpers.arrayElement(imageIds),
        designId
      );

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
