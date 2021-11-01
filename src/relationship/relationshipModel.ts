import {BaseDataRecord,Attribute, ValueType} from '../dataset';

// base interface to define the required parameters for determining a meaningful data
// relationship
export interface RelationshipModel {
  name: string; // name of the model

  // if needed, train the model first with the given training set
  train?: (trainingSet: BaseDataRecord[]) => void;
}

// used to define the required parameters for determining a meaningful data
// relationship for a univariate observation
export interface UnivariateRelationshipModel extends RelationshipModel {
  outputAttribute: Attribute; // inputs used to simulate output

  // for the given record, simulate the output attribute value.
  // One record should be provided for each relevant dataset involved.
  simulate: () => ValueType;
}

// used to define the required parameters for determining a meaningful data
// relationship for a multivariate observation
export interface MultivariateRelationshipModel extends RelationshipModel {
  inputAttributes: Attribute[]; // inputs used to predict output
  outputAttribute: Attribute; // output to be predicted

  // for the given record, predict the output attribute value using the input
  // attributes. One record should be provided for each relevant dataset involved.
  predict: (record: BaseDataRecord) => ValueType;
}
