import { convertToIntegers } from '../util';
import { MultivariateRelationshipModel } from './RelationshipModel';
import { DataRecord, Attribute, AttributeType, ValueType } from '../dataset';
import { GaussianNB } from 'ml-naivebayes';

// NOTE: the 'ml-naivebayes' library assumes that at least two input attributes
// are included for modeling purposes

export class GaussianNaiveBayesRelationshipModel implements MultivariateRelationshipModel {
  name: string; // name of the model
  inputAttributes: Attribute[]; // inputs used to predict output
  outputAttribute: Attribute; // output to be predicted
  model: GaussianNB;
  mapping: ValueType[];

  constructor(name: string, inputAttributes: Attribute[], outputAttribute: Attribute) {
    if(inputAttributes.some(a => a.attributeType !== AttributeType.quantitative) ||
      outputAttribute.attributeType !== AttributeType.quantitative) {
        throw new Error("GaussianNaiveBayesRelationshipModel can only be used with quantitative attributes.");
    }

    this.name = name;
    this.inputAttributes = inputAttributes;
    this.outputAttribute = outputAttribute;
    this.model = null;
    this.mapping = null;
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
      let allnums: boolean = this.inputAttributes.map((a) => r.getValueByName(a.name))
        .every((e) => typeof e === "number");
      allnums = allnums && typeof r.getValueByName(this.outputAttribute.name) === "number";
      if(allnums) { // ignore rows with null values
        const xvec: number[] = this.inputAttributes.map((a) => r.getValueByName(a.name) as number);
        const yvec: number = r.getValueByName(this.outputAttribute.name) as number;
        x.push(xvec);
        y.push(yvec);
      }
    }
    const { mapped, mapping } = convertToIntegers(y); // map to class numbers
    this.mapping = mapping;
    this.model = new GaussianNB();
    this.model.train(x, mapped); // train on the mapped class numbers;
  }

  predict(record: DataRecord): ValueType {
    for(let j = 0; j < this.inputAttributes.length; j++) {
      if(typeof record.getValueByName(this.inputAttributes[j].name) !== "number") {
        throw new Error("input attribute '" + this.inputAttributes[j].name + "' is not of type 'number'.");
      }
    }
    const xvec: number[] = this.inputAttributes.map((a) => record.getValueByName(a.name) as number);
    const res = this.model.predict([xvec]);
    return this.mapping[res[0]]; // map back to original value
  }
}
