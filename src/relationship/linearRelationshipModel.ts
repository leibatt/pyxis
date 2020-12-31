import {RelationshipModel} from './relationshipModel';
import {BaseDataRecord,Attribute,AttributeType,ValueType} from '../dataset';
import MLR from 'ml-regression-multivariate-linear';

export class LinearRelationshipModel implements RelationshipModel {
  name: string; // name of the model
  inputAttributes: Attribute[]; // inputs used to predict output
  outputAttribute: Attribute; // output to be predicted
  model: MLR;

  constructor(name: string, inputAttributes: Attribute[], outputAttribute: Attribute) {
    for(let i = 0; i < inputAttributes.length; i++) {
      if(inputAttributes[i].attributeType !== AttributeType.quantitative) {
        throw new Error("LinearRelationshipModel can only be used with quantitative attributes.");
      }
    }
    if(outputAttribute.attributeType !== AttributeType.quantitative) {
      throw new Error("LinearRelationshipModel can only be used with quantitative attributes.");
    }

    this.name = name;
    this.inputAttributes = inputAttributes;
    this.outputAttribute = outputAttribute;
    this.model = null;
  }

  train(trainingSet: BaseDataRecord[]): void {
    const x = [];
    const y = [];
    if(trainingSet.length === 0) return;

    for(let j = 0; j < this.inputAttributes.length; j++) {
      if(typeof trainingSet[0].getValueByName(this.inputAttributes[j].name) !== "number") {
        throw new Error("input attribute '" + this.inputAttributes[j].name + "' is not of type 'number'.");
      }
    }
    if(typeof trainingSet[0].getValueByName(this.outputAttribute.name) !== "number") {
      throw new Error("input attribute '" + this.outputAttribute.name + "' is not of type 'number'.");
    }


    for(let i = 0; i < trainingSet.length; i++) {
      const r: BaseDataRecord = trainingSet[i];
      const xvec = this.inputAttributes.map((a) => r.getValueByName(a.name) as number);
      console.log(xvec);
      const yvec = [r.getValueByName(this.outputAttribute.name) as number];
      console.log(yvec);
      x.push(xvec);
      y.push(yvec);
    }
    this.model = new MLR(x, y);
  }

  predict(record: BaseDataRecord): ValueType {
    for(let j = 0; j < this.inputAttributes.length; j++) {
      if(typeof record.getValueByName(this.inputAttributes[j].name) !== "number") {
        throw new Error("input attribute '" + this.inputAttributes[j].name + "' is not of type 'number'.");
      }
    }
    const xvec = this.inputAttributes.map((a) => record.getValueByName(a.name) as number);
    console.log(xvec);
    return this.model.predict(xvec)[0];
  }
}
