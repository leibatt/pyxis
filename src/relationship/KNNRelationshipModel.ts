import { MultivariateRelationshipModel } from './RelationshipModel';
import { DataRecord, Attribute, AttributeType, ValueType } from '../dataset';
import KNN from 'ml-knn';

export class KNNRelationshipModel implements MultivariateRelationshipModel {
  name: string; // name of the model
  inputAttributes: Attribute[]; // inputs used to predict output
  outputAttribute: Attribute; // output to be predicted
  model: KNN;

  constructor(name: string, inputAttributes: Attribute[], outputAttribute: Attribute) {
    if(inputAttributes.some(a => a.attributeType !== AttributeType.quantitative) ||
      outputAttribute.attributeType !== AttributeType.quantitative) {
        throw new Error("KNNRelationshipModel can only be used with quantitative attributes.");
    }

    this.name = name;
    this.inputAttributes = inputAttributes;
    this.outputAttribute = outputAttribute;
    this.model = null;
  }

  train(trainingSet: DataRecord[]): void {
    const x: number[][] = [];
    const y: number[] = [];
    if(!trainingSet || trainingSet.length === 0) {
      throw new Error("No training data provided.");
    }

    // are these input attribute values numbers?
    for(let j = 0; j < this.inputAttributes.length; j++) {
      if(typeof trainingSet[0].getValueByName(this.inputAttributes[j].name) !== "number") {
        throw new Error("input attribute '" + this.inputAttributes[j].name + "' is not of type 'number'.");
      }
    }
    // is this output attribute value a number?
    if(typeof trainingSet[0].getValueByName(this.outputAttribute.name) !== "number") {
      throw new Error("output attribute '" + this.outputAttribute.name + "' is not of type 'number'.");
    }

    for(let i = 0; i < trainingSet.length; i++) {
      const r: DataRecord = trainingSet[i];
      const xvec: number[] = this.inputAttributes.map((a) => r.getValueByName(a.name) as number);
      const yvec: number = r.getValueByName(this.outputAttribute.name) as number;
      x.push(xvec);
      y.push(yvec);
    }
    this.model = new KNN(x, y);
  }

  predict(record: DataRecord): ValueType {
    for(let j = 0; j < this.inputAttributes.length; j++) {
      if(typeof record.getValueByName(this.inputAttributes[j].name) !== "number") {
        throw new Error("input attribute '" + this.inputAttributes[j].name + "' is not of type 'number'.");
      }
    }
    const xvec: number[] = this.inputAttributes.map((a) => record.getValueByName(a.name) as number);
    return this.model.predict(xvec);
  }
}
