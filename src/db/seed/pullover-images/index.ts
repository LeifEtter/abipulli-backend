import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Normal Files
const blackFront: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/black/front.png")
);
const blackBack: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/black/back.png")
);

const cyanFront: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/cyan/front.png")
);
const cyanBack: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/cyan/back.png")
);

const pinkFront: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/pink/front.png")
);
const pinkBack: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/pink/back.png")
);
const purpleFront: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/purple/front.png")
);
const purpleBack: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/purple/back.png")
);
const whiteFront: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/white/front.png")
);
const whiteBack: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/white/back.png")
);
const sandFront: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/sand/front.png")
);
const sandBack: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/sand/back.png")
);
const greyFront: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/grey/front.png")
);
const greyBack: Buffer = fs.readFileSync(
  path.join(__dirname, "./normal/grey/back.png")
);

// Heavy Files
const heavyBlackFront: Buffer = fs.readFileSync(
  path.join(__dirname, "./heavy/black/front.png")
);
const heavyBlackBack: Buffer = fs.readFileSync(
  path.join(__dirname, "./heavy/black/back.png")
);

const heavyBrownFront: Buffer = fs.readFileSync(
  path.join(__dirname, "./heavy/brown/front.png")
);
const heavyBrownBack: Buffer = fs.readFileSync(
  path.join(__dirname, "./heavy/brown/back.png")
);

const heavyWhiteFront: Buffer = fs.readFileSync(
  path.join(__dirname, "./heavy/white/front.png")
);
const heavyWhiteBack: Buffer = fs.readFileSync(
  path.join(__dirname, "./heavy/white/back.png")
);

export interface PulloverDataWithFile {
  fileFront: Buffer;
  fileBack: Buffer;
  name: string;
  description: string;
  base_price: number;
  color: string;
  hoodie: false;
}
export const heavyPullovers: PulloverDataWithFile[] = [
  {
    fileFront: heavyBlackFront,
    fileBack: heavyBlackBack,
    name: "Heavy Oversized Schwarz",
    description: "Schwarzer Heavy 100% Wolle Oversized Pullover",
    base_price: 40,
    color: "schwarz",
    hoodie: false,
  },
  {
    fileFront: heavyWhiteFront,
    fileBack: heavyWhiteBack,
    name: "Heavy Oversized Weiß",
    description: "Weißer Heavy 100% Wolle Oversized Pullover",
    base_price: 40,
    color: "weiss",
    hoodie: false,
  },
  {
    fileFront: heavyBrownFront,
    fileBack: heavyBrownBack,
    name: "Heavy Oversized Braun",
    description: "Brauner Heavy 100% Wolle Oversized Pullover",
    base_price: 40,
    color: "braun",
    hoodie: false,
  },
];

export const normalPullovers: PulloverDataWithFile[] = [
  {
    fileFront: blackFront,
    fileBack: blackBack,
    name: "Normal Oversized Schwarz",
    description: "Schwarzer Normal 100% Wolle Oversized Pullover",
    base_price: 30,
    color: "schwarz",
    hoodie: false,
  },
  {
    fileFront: cyanFront,
    fileBack: cyanBack,
    name: "Normal Oversized Cyan",
    description: "Cyaner Normal 100% Wolle Oversized Pullover",
    base_price: 30,
    color: "cyan",
    hoodie: false,
  },
  {
    fileFront: pinkFront,
    fileBack: pinkBack,
    name: "Normal Oversized Pink",
    description: "Pinker Normal 100% Wolle Oversized Pullover",
    base_price: 30,
    color: "pink",
    hoodie: false,
  },
  {
    fileFront: purpleFront,
    fileBack: purpleBack,
    name: "Normal Oversized Purple",
    description: "Violetter Normal 100% Wolle Oversized Pullover",
    base_price: 30,
    color: "violett",
    hoodie: false,
  },
  {
    fileFront: heavyWhiteFront,
    fileBack: heavyWhiteBack,
    name: "Heavy Oversized Weiß",
    description: "Weißer Heavy 100% Wolle Oversized Pullover",
    base_price: 30,
    color: "weiss",
    hoodie: false,
  },
  {
    fileFront: sandFront,
    fileBack: sandBack,
    name: "Normal Oversized Sand",
    description: "Sandfarbener Normal 100% Wolle Oversized Pullover",
    base_price: 30,
    color: "sand",
    hoodie: false,
  },
  {
    fileFront: greyFront,
    fileBack: greyBack,
    name: "Normal Oversized Grey",
    description: "Grauer Normal 100% Wolle Oversized Pullover",
    base_price: 30,
    color: "grau",
    hoodie: false,
  },
];
