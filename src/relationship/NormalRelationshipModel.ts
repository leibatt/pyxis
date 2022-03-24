import { randomNormal, NormalDistribution } from 'vega-statistics';
import { UnivariateRelationshipModel } from './RelationshipModel';
import { DataRecord, Attribute, AttributeType, ValueType } from '../dataset';

export class NormalRelationshipModel implements UnivariateRelationshipModel {
  name: string; // name of the model
  inputAttribute: Attribute; // input to be simulated
  model: NormalDistribution;

  constructor(name: string, inputAttribute: Attribute) {
    if(inputAttribute.attributeType !== AttributeType.quantitative) {
      throw new Error("NormalRelationshipModel can only be used with quantitative attributes.");
    }

    this.name = name;
    this.inputAttribute = inputAttribute;
    this.model = null;
  }

  train(trainingSet: DataRecord[]): void {
    if(!trainingSet || trainingSet.length === 0) {
      throw new Error("No training data provided.");
    }

    // are these input attribute values numbers?
    if(typeof trainingSet[0].getValueByName(this.inputAttribute.name) !== "number") {
      throw new Error("input attribute '" + this.inputAttribute.name + "' is not of type 'number'.");
    }

    const vals: number[] = trainingSet.map(r => r.getValueByName(this.inputAttribute.name) as number);
    const mean = vals.reduce((a, b) => a + b) / vals.length;
    const stdev = Math.sqrt(vals.map((v: number) => Math.pow(v - mean, 2)).reduce((a, b) => a + b) / vals.length);

    this.model = randomNormal(mean,stdev);
  }

  // generate a sample from the learned distribution
  simulate(): ValueType {
    return this.model.sample();
  }
}
