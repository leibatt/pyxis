import { OutlierRelationshipModel } from './RelationshipModel';
import { DataRecord, Attribute, ValueType } from '../dataset';
import { IsolationForest } from 'isolation-forest';

export class IsolationForestRelationshipModel implements OutlierRelationshipModel {
  name: string; // name of the model
  inputAttributes: Attribute[]; // inputs used to predict output
  model: IsolationForest;

  constructor(name: string, inputAttributes: Attribute[]) {
    this.name = name;
    this.inputAttributes = inputAttributes;
    this.model = null;
  }

  train(trainingSet: DataRecord[]): void {
    if(!trainingSet || trainingSet.length === 0) {
      throw new Error("No training data provided.");
    }

    const dataset = [];

    for(let i = 0; i < trainingSet.length; i++) {
      const r = trainingSet[i];
      const nr = this.inputAttributes.reduce((c,a) => { c[a.name] = r.getValueByName(a.name); return c; },{});
      dataset.push(nr);
    }
    this.model = new IsolationForest();
    this.model.fit(dataset);
  }

  predict(record: DataRecord): ValueType {
    const inputs = this.inputAttributes.reduce((c,a) => { c[a.name] = record.getValueByName(a.name); return c; },{});
    // library always casts the labels to strings, and only returns strings
    const res: number[] = this.model.predict([inputs]);
    return res[0];
  }
}
