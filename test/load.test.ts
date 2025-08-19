import * as fs from 'fs';
import * as path from 'path';
import { loadDataset, exportDatasetJson } from '../src/load';

describe("load.ts tests", () => {
  describe("#loadDataset", () => {
    test("load works", () => {
      const carsDataset = loadDataset("cars.json","cars");
      expect(carsDataset.name).toBe("cars");
    });
    test("load works with external filepath", () => {
      const carsDataset = loadDataset("cars.json","cars2",{},path.join(__dirname,"..","datasets"));
      expect(carsDataset.name).toBe("cars2");
    });
  });
  describe("#exportDatasetJson", () => {
    test("export works", () => {
      const carsDataset = loadDataset("cars.json","cars");
      exportDatasetJson(carsDataset,"cars2.json");
      const carsDatasetCopy = loadDataset("cars2.json","cars2");
      expect(carsDatasetCopy.name).toBe("cars2");
      // delete copy
      fs.unlinkSync(path.join(__dirname,"..","datasets","cars2.json"));
    });
    test("export works with external filepath", () => {
      const carsDataset = loadDataset("cars.json","cars");
      exportDatasetJson(carsDataset,"cars3.json",path.join(__dirname,"..","datasets"));
      const carsDatasetCopy = loadDataset("cars3.json","cars3",{},path.join(__dirname,"..","datasets"));
      expect(carsDatasetCopy.name).toBe("cars3");
      // delete copy
      fs.unlinkSync(path.join(__dirname,"..","datasets","cars3.json"));
    });
  });
});
