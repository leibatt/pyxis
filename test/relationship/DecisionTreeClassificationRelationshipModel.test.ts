import * as path from 'path';
import { loadJsonFile } from '../../src/load';
import { Attribute, AttributeType, BaseDataRecord, Dataset, jsonObjectToDataset, ValueType} from '../../src/dataset';
import { DecisionTreeClassificationRelationshipModel} from '../../src/relationship/DecisionTreeClassificationRelationshipModel';

// dataset for testing purposes
const carsDataset = loadJsonFile(path.join(__dirname,"..","..","datasets","cars.json"));

describe('DecisionTreeClassificationRelationshipModel', () => {
  test('#constructor works', () => {
    const dtrm: DecisionTreeClassificationRelationshipModel = new DecisionTreeClassificationRelationshipModel(
      "test",
      [ // input attributes
        {
          name: "x",
          attributeType: AttributeType.quantitative
        }
      ],
      { // output attribute
        name: "y",
        attributeType: AttributeType.quantitative
      }
    );
    expect(dtrm.name).toBe("test");
    expect(dtrm.model).toBeNull();
  });
  test('#train runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const dtrm: DecisionTreeClassificationRelationshipModel = new DecisionTreeClassificationRelationshipModel(
      "cars",
      [ // input attributes
        {
          name: "Weight_in_lbs",
          attributeType: AttributeType.quantitative
        },
        {
          name: "Horsepower",
          attributeType: AttributeType.quantitative
        }
      ],
      { // output attribute
        name: "Cylinders",
        attributeType: AttributeType.quantitative
      }
    );
    expect(() => { dtrm.train(cars.records); }).not.toThrow();
  });
  test('#predict runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const dtrm: DecisionTreeClassificationRelationshipModel = new DecisionTreeClassificationRelationshipModel(
      "cars",
      [ // input attributes
        {
          name: "Weight_in_lbs",
          attributeType: AttributeType.quantitative
        },
        {
          name: "Horsepower",
          attributeType: AttributeType.quantitative
        }
      ],
      { // output attribute
        name: "Cylinders",
        attributeType: AttributeType.quantitative
      }
    );
    dtrm.train(cars.records);
    const res: ValueType = dtrm.predict(cars.records[0]);
    expect(res).toEqual(expect.anything());
  });
  test('#train throws error if training set does not exist', () => {
    const attributes: Attribute[] = [
      {"name":"x", "attributeType": AttributeType.quantitative},
      {"name":"y", "attributeType": AttributeType.quantitative}
    ];
    const dtrm: DecisionTreeClassificationRelationshipModel = new DecisionTreeClassificationRelationshipModel(
      "y=x",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    expect(() => { return dtrm.train(null) }).toThrow("No training data provided.");
    expect(() => { return dtrm.train(undefined) }).toThrow("No training data provided.");
    expect(() => { return dtrm.train([]) }).toThrow("No training data provided.");
  });
  test('#predict 3 clusters', () => {
    const dataRecords: BaseDataRecord[] = [];
    const attributes: Attribute[] = [
      {"name":"x", "attributeType": AttributeType.quantitative},
      {"name":"y", "attributeType": AttributeType.quantitative}
    ];
    for(let i = 0; i < 10; i++) {
      dataRecords.push(new BaseDataRecord(
        attributes,
        {
          "x": i,
          "y": 0
        },
        i+"-"+0
      ));
    }
    for(let i = 10; i < 20; i++) {
      dataRecords.push(new BaseDataRecord(
        attributes,
        {
          "x": i,
          "y": 16
        },
        i+"-"+16
      ));
    }
    for(let i = 20; i < 30; i++) {
      dataRecords.push(new BaseDataRecord(
        attributes,
        {
          "x": i,
          "y": 100
        },
        i+"-"+100
      ));
    }
    const dtrm: DecisionTreeClassificationRelationshipModel = new DecisionTreeClassificationRelationshipModel(
      "predict 3 clusters",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    dtrm.train(dataRecords);
    let res: ValueType = dtrm.predict(dataRecords[5]);
    expect(res).toBe(0);
    res = dtrm.predict(dataRecords[15]);
    expect(res).toBe(16);
    res = dtrm.predict(dataRecords[25]);
    expect(res).toBe(100);
  });
});
