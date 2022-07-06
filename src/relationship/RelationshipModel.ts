import { DataRecord,Attribute, ValueType } from '../dataset';

// base interface to define the required parameters for determining a meaningful data
// relationship
export interface RelationshipModel {
  name: string; // name of the model

  // if needed, train the model first with the given training set
  train?: (trainingSet: DataRecord[]) => void;
}

// used to define the required parameters for determining a meaningful data
// relationship for a univariate observation
export interface UnivariateRelationshipModel extends RelationshipModel {
  inputAttribute: Attribute; // inputs used to simulate output

  // for the given record, simulate the output attribute value.
  simulate: () => ValueType;
}

// used to define the required parameters for determining a meaningful data
// relationship for a multivariate observation
export interface MultivariateRelationshipModel extends RelationshipModel {
  inputAttributes: Attribute[]; // inputs used to predict output
  outputAttribute: Attribute; // output to be predicted

  // for the given record, predict the output attribute value using the input
  // attributes.
  predict: (record: DataRecord) => ValueType;
}

// used to define the required parameters for determining a meaningful data
// relationship for a multivariate observation
export interface OutlierRelationshipModel extends RelationshipModel {
  inputAttributes: Attribute[]; // inputs used to predict output

  // for the given record, predict whether the record is an outlier.
  predict: (record: DataRecord) => ValueType;
}
