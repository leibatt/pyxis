import { RelationshipModel } from './relationshipModel';
import { DataRecord, Attribute, AttributeType, ValueType } from '../dataset';
import { DecisionTree } from './../../lib/decision-tree-js/decision-tree';

export class DecisionTreeClassificationRelationshipModel implements RelationshipModel {
  name: string; // name of the model
  inputAttributes: Attribute[]; // inputs used to predict output
  outputAttribute: Attribute; // output to be predicted
  model: DecisionTree;

  constructor(name: string, inputAttributes: Attribute[], outputAttribute: Attribute) {
    this.name = name;
    this.inputAttributes = inputAttributes;
    this.outputAttribute = outputAttribute;
    this.model = null;
  }

  train(trainingSet: DataRecord[]): void {
    if(!trainingSet || trainingSet.length === 0) {
      throw new Error("No training data provided.");
    }

    const dataset = [];

    for(let i = 0; i < trainingSet.length; i++) {
      const r: DataRecord = trainingSet[i];
      const nr: Record<string, ValueType | null> = {};
      this.inputAttributes.forEach((a) => { nr[a.name] = r.getValueByName(a.name); });
      nr[this.outputAttribute.name] = r.getValueByName(this.outputAttribute.name);
      dataset.push(nr);
    }
    const config = {
      trainingSet: dataset,
      categoryAttr: this.outputAttribute.name,
      ignoredAttributes: [] as string[]
    };
    this.model = new DecisionTree(config);
  }

  predict(record: DataRecord): ValueType {
    const inputs = this.inputAttributes.reduce((c,a) => { c[a.name] = record.getValueByName(a.name); return c; },{});
    console.log(inputs,this.model.predict(inputs));
    return this.model.predict(inputs);
  }
}
