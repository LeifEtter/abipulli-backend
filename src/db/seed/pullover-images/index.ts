import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Abicetamol
const black: Buffer = fs.readFileSync(
  path.join(__dirname, "./black-front.png")
);
const cyan: Buffer = fs.readFileSync(path.join(__dirname, "./cyan-front.png"));
const pink: Buffer = fs.readFileSync(path.join(__dirname, "./pink-front.png"));
const purple: Buffer = fs.readFileSync(
  path.join(__dirname, "./purple-front.png")
);
const white: Buffer = fs.readFileSync(
  path.join(__dirname, "./white-front.png")
);
const sand: Buffer = fs.readFileSync(path.join(__dirname, "./sand-front.png"));
const grey: Buffer = fs.readFileSync(path.join(__dirname, "./grey-front.png"));

export interface PulloverDataWithFile {
  file: Buffer;
  name: string;
  description: string;
  base_price: number;
  color: string;
  hoodie: false;
}
const pullovers: PulloverDataWithFile[] = [
  {
    file: black,
    name: "Heavy Oversized Schwarz",
    description: "Schwarzer Heavy 100% Wolle Oversized Pullover",
    base_price: 50,
    color: "schwarz",
    hoodie: false,
  },
  {
    file: cyan,
    name: "Heavy Oversized Cyan",
    description: "Cyaner Heavy 100% Wolle Oversized Pullover",
    base_price: 50,
    color: "cyan",
    hoodie: false,
  },
  {
    file: pink,
    name: "Heavy Oversized Pink",
    description: "Pinker Heavy 100% Wolle Oversized Pullover",
    base_price: 50,
    color: "pink",
    hoodie: false,
  },
  {
    file: purple,
    name: "Heavy Oversized Purple",
    description: "Violetter Heavy 100% Wolle Oversized Pullover",
    base_price: 50,
    color: "violett",
    hoodie: false,
  },
  {
    file: white,
    name: "Heavy Oversized Weiß",
    description: "Weißer Heavy 100% Wolle Oversized Pullover",
    base_price: 50,
    color: "weiss",
    hoodie: false,
  },
  {
    file: sand,
    name: "Heavy Oversized Sand",
    description: "Sandfarbener Heavy 100% Wolle Oversized Pullover",
    base_price: 50,
    color: "sand",
    hoodie: false,
  },
  {
    file: grey,
    name: "Heavy Oversized Grey",
    description: "Grauer Heavy 100% Wolle Oversized Pullover",
    base_price: 50,
    color: "grau",
    hoodie: false,
  },
];

export default pullovers;
