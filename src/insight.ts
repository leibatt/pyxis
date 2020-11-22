import {BaseDataset,DataRecord,Attribute,ValueType} from './dataset';

// the range of insights to be covered in this theory work
// clustering, correlation, causal, outliers/exclusion
export enum InsightType {
  cluster,
  correlation,
  causal,
  exclusion
}

// used to define the required parameters for determining a meaningful data
// relationship
export interface RelationshipModelInterface {
  name: string; // name of the model
  inputAttributes?: Attribute[]; // inputs used to predict output relationship
  outputAttribute?: Attribute; // output to be predicted

  // if the relationship involves multiple datasets, explains how to
  // consolidate them into one for training
  join(datasets: BaseDataset[]): BaseDataset;

  // if needed, train the model first with the given training set
  train(trainingSet: DataRecord[]): void;

  // for the given record, predict the output attribute value using the input
  // attributes. One record should be provided for each relevant dataset involved.
  predict(records: DataRecord[]): ValueType;
}

// at the base level, an insight represents some relationshp within one or more datasets
export interface BaseInsightInterface {
  name: string;
  insightType: InsightType;
  description?: string;

  datasets: BaseDataset[];
  relationshipModel: RelationshipModelInterface;
}

// more complex insights FINISH THOUGHT
export interface InsightInterface {
  name: string;
  insightType: InsightType;
  description?: string;

  //parent insights
  dependsOn?: (InsightInterface | BaseInsightInterface)[];
  // peer insights, insights may be grouped together in a collection
  associatedWith?: (InsightInterface | BaseInsightInterface)[];
  contributesTo?: (InsightInterface | BaseInsightInterface)[];
}

// there seems to be a relationship across this group of records, defined by
// the given set of attributes
export class RelatedRelationship {
  attributes: Attribute[];
  records: DataRecord[];

  constructor(attributes: Attribute[], records: DataRecord[]) {
    this.attributes = attributes;
    this.records = records;
  }
}

export class CausalRelationship {
  attributes: Attribute[];
  inputDataRecords: DataRecord[];
  outputDataRecords: DataRecord[];

  constructor(attributes: Attribute[], inputDataRecords: DataRecord[], outputDataRecords: DataRecord[]) {
    this.attributes = attributes;
    this.inputDataRecords = inputDataRecords;
    this.outputDataRecords = outputDataRecords;
  }
}

// TODO: create this class
// export class Insight {
//   
// 
// }

