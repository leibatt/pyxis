import * as carsDataset from '../../datasets/cars.json'; // dataset for testing purposes
import { Attribute, AttributeType, BaseDataRecord, Dataset, jsonObjectToDataset, ValueType} from '../../src/dataset';
import { KNNRelationshipModel } from '../../src/relationship/KNNRelationshipModel';

describe('KNNRelationshipModel', () => {
  test('#constructor works', () => {
    const dtrm: KNNRelationshipModel = new KNNRelationshipModel(
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
    expect(dtrm.name).toEqual("test");
    expect(dtrm.model).toBeNull();
  });
  test('#train runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const dtrm: KNNRelationshipModel = new KNNRelationshipModel(
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
    const dtrm: KNNRelationshipModel = new KNNRelationshipModel(
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
    const dtrm: KNNRelationshipModel = new KNNRelationshipModel(
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
    for(let i = 50; i < 60; i++) {
      dataRecords.push(new BaseDataRecord(
        attributes,
        {
          "x": i,
          "y": 1
        },
        i+"-"+1
      ));
    }
    for(let i = 90; i < 100; i++) {
      dataRecords.push(new BaseDataRecord(
        attributes,
        {
          "x": i,
          "y": 2
        },
        i+"-"+2
      ));
    }
    const dtrm: KNNRelationshipModel = new KNNRelationshipModel(
      "predict 3 clusters",
      // input attributes
      attributes.filter(a => a.name === "x"),
      // output attribute
      attributes.filter(a => a.name === "y")[0]
    );
    dtrm.train(dataRecords);
    let res: ValueType = dtrm.predict(dataRecords[5]);
    expect(res).toEqual(0);
    res = dtrm.predict(dataRecords[15]);
    expect(res).toEqual(1);
    res = dtrm.predict(dataRecords[25]);
    expect(res).toEqual(2);
  });
});