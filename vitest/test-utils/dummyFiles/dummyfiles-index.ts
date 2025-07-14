// LOAD ALL Image FILES IN THIS FOLDER INTO SINGLE OBJECT
import fs from "fs";
import path from "path";

// Abicetamol
const abicetamol1: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abicetamol-1.jpeg")
);

// Abikropolis
const abikropolis1: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abikropolis-1.png")
);
const abikropolis2: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abikorpolis-2.jpeg")
);

// Abinsbett
const abinsbett1: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abinsbett-1.png")
);
const abinsbett2: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abinsbett-2.png")
);
const abinsbett3: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abinsbett-3.png")
);
const abinsbett4: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abinsbett-4.png")
);

// Abirol
const abirol1: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abirol-1.jpeg")
);
const abirol2: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abirol-2.jpeg")
);
const abirol3: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abirol-3.jpeg")
);
const abirol3Back: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abirol-3-Back.png")
);

// Abivegas
const abivegas1: Buffer = fs.readFileSync(
  path.join("test-utils/dummyFiles/Abivegas-1.png")
);

const dummyImages = [
  abicetamol1,
  abikropolis1,
  abikropolis2,
  abinsbett1,
  abinsbett2,
  abinsbett3,
  abinsbett4,
  abirol1,
  abirol2,
  abirol3,
  abirol3Back,
  abivegas1,
];

export default dummyImages;
