import {Dataset,BaseDataRecord,Attribute} from './dataset';

// used to define the required parameters for determining a meaningful data
// relationship
export interface RelationshipModel {
  name: string; // name of the model
  inputAttributes: Attribute[]; // inputs used to predict output
  outputAttribute: Attribute; // output to be predicted

  // if the relationship involves multiple datasets, explains how to
  // consolidate them into one for training
  join?: (datasets: Dataset[]) => Dataset;

  // if the data must be aggregated before assessing the relationship,
  // explains how to consolidate into aggregated rows for training
  aggregate?: (dataset: Dataset[]) => Dataset;

  // if needed, train the model first with the given training set
  train?: (trainingSet: BaseDataRecord[]) => void;

  // for the given record, predict the output attribute value using the input
  // attributes. One record should be provided for each relevant dataset involved.
  predict: (record: BaseDataRecord) => ValueType;
}
