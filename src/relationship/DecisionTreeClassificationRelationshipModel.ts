import { MultivariateRelationshipModel } from './relationshipModel';
import { DataRecord, Attribute, AttributeType, ValueType } from '../dataset';
import { DecisionTree } from './../../lib/decision-tree-js/decision-tree';

/*
NOTE: the underlyling decision tree library assumes that the output labels are
always strings (if not, it coerces the labels into strings). Even if you pass
numbers, they will still be treated as nominal values when training the
model...
*/
export class DecisionTreeClassificationRelationshipModel implements MultivariateRelationshipModel {
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
    // library always casts the labels to strings, and only returns strings
    const res: string = this.model.predict(inputs);
    // cast back to number if the output label was originally quantitative
    const fres: ValueType = (this.outputAttribute.attributeType == AttributeType.quantitative) ? Number(res) : res;
    console.log(inputs,fres);
    return fres;
  }
}
