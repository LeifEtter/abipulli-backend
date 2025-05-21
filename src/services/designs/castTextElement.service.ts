import { TextElement } from "abipulli-types";
import { SelectTextElement } from "db";

//TODO: Fix ! in positions
export const castTextElement = (
  textElement: SelectTextElement
): TextElement => {
  return {
    id: textElement.id,
    createdAt: new Date(textElement.created_at),
    text: textElement.content,
    positionX: textElement.position_x!,
    positionY: textElement.position_y!,
    fontSize: 16,
    fontColor: "#000000",
    fontWeight: 400,
    fontStyle: "normal",
  };
};
