import { ImproveImageQueryParams } from "abipulli-types";

export const buildBasicPrompt = ({
  motto,
  description,
  styleTags,
}: ImproveImageQueryParams): string => {
  const prompt = `
    You are generating a visual design prompt for Ideogram.ai. The design is for graduation pullovers (Abitur), to be printed on fabric. 
    This means: 
      - No background colors 
      - Limited color palette 
      - Bold, graphic, non-photorealistic style 
      - Focus on the theme and wordplay around “ABI” 
    Use the theme below to generate a prompt describing: 
      - Composition (foreground/background) 
      - Visual symbols or objects 
      - Characters or poses 
      - Art style (e.g. screen print, cartoon, retro) 
    Include the word ${motto} prominently in the design. 
    Theme ${description}
    Style Tags: ${styleTags.toString()}
    Output only a single paragraph of plain text describing the scene. 
    Avoid using any formatting like asterisks (**), bullet points, or newline characters. 
    Do not include labels like 'Theme' or 'Style' — just describe the visual composition naturally, as if giving a scene prompt to an image generator.`;
  return prompt;
};
