import * as carsDataset from '../../datasets/cars.json'; // dataset for testing purposes
import { Attribute, AttributeType, BaseDataRecord, Dataset, jsonObjectToDataset, ValueType} from '../../src/dataset';
import { IsolationForestRelationshipModel } from '../../src/relationship/IsolationForestRelationshipModel';

describe('IsolationForestRelationshipModel', () => {
  test('#constructor works', () => {
    const dtrm: IsolationForestRelationshipModel = new IsolationForestRelationshipModel(
      "test",
      [ // input attributes
        {
          name: "x",
          attributeType: AttributeType.quantitative
        },
        { // output attribute
          name: "y",
          attributeType: AttributeType.quantitative
        }
      ]
    );
    expect(dtrm.name).toEqual("test");
    expect(dtrm.model).toBeNull();
  });
  test('#train runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const dtrm: IsolationForestRelationshipModel = new IsolationForestRelationshipModel(
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
      ]
    );
    expect(() => { dtrm.train(cars.records); }).not.toThrow();
  });
  test('#predict runs without errors', () => {
    const cars: Dataset = jsonObjectToDataset(carsDataset,"cars");
    const dtrm: IsolationForestRelationshipModel = new IsolationForestRelationshipModel(
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
      ]
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
    const dtrm: IsolationForestRelationshipModel = new IsolationForestRelationshipModel(
      "y=x",
      // input attributes
      attributes,
    );
    expect(() => { return dtrm.train(null) }).toThrow("No training data provided.");
    expect(() => { return dtrm.train(undefined) }).toThrow("No training data provided.");
    expect(() => { return dtrm.train([]) }).toThrow("No training data provided.");
  });
  test('#predict outlier', () => {
    const dataRecords: BaseDataRecord[] = [];
    const attributes: Attribute[] = [
      {"name":"x", "attributeType": AttributeType.quantitative},
      {"name":"y", "attributeType": AttributeType.quantitative}
    ];
    for(let i = 0; i < 50; i++) {
      dataRecords.push(new BaseDataRecord(
        attributes,
        {
          "x": Math.random(),
          "y": Math.random()
        },
        i + ""
      ));
    }
    // generate an obvious outlier
    dataRecords.push(new BaseDataRecord(
      attributes,
      {
        "x": 25,
        "y": -25
      },
      "50"
    ));
    const dtrm: IsolationForestRelationshipModel = new IsolationForestRelationshipModel(
      "predict outlier",
      // input attributes
      attributes,
    );
    console.log(dataRecords[50]);
    dtrm.train(dataRecords);
    const res: ValueType = dtrm.predict(dataRecords[50]); // should be the outlier
    expect(res).toBeGreaterThan(0.8);
    console.log(res);
    // If instances return a score very close to 1, then they are definitely anomalies.
    // If instances have a score much smaller than 0.5, then they are quite safe to be regarded as normal instances.
    // If all the instances return a score ≈ 0.5, then the entire sample does not really have any distinct anomaly.
  });
});
