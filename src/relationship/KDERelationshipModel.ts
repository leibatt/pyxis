import { randomKDE, Distribution } from 'vega-statistics';
import { UnivariateRelationshipModel } from './RelationshipModel';
import { DataRecord, Attribute, AttributeType, ValueType } from '../dataset';

export class KDERelationshipModel implements UnivariateRelationshipModel {
  name: string; // name of the model
  inputAttribute: Attribute; // input to be simulated
  model: Distribution;

  constructor(name: string, inputAttribute: Attribute) {
    if(inputAttribute.attributeType !== AttributeType.quantitative) {
      throw new Error("KDERelationshipModel can only be used with quantitative attributes.");
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

    this.model = randomKDE(trainingSet.map(r => r.getValueByName(this.inputAttribute.name) as number));
  }

  // generate a sample from the learned distribution
  simulate(): ValueType {
    return this.model.sample();
  }
}
