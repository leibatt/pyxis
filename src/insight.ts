import {Dataset,DataRecord,Attribute,ValueType} from './dataset';

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
export interface RelationshipModel {
  name: string; // name of the model
  inputAttributes?: Attribute[]; // inputs used to predict output
  outputAttribute?: Attribute; // output to be predicted

  // if the relationship involves multiple datasets, explains how to
  // consolidate them into one for training
  join?: (datasets: Dataset[]) => Dataset;

  // if needed, train the model first with the given training set
  train?: (trainingSet: DataRecord[]) => void;

  // for the given record, predict the output attribute value using the input
  // attributes. One record should be provided for each relevant dataset involved.
  predict: (records: DataRecord[]) => ValueType;
}

// An insight represents some relationshp within one or more datasets.
// However insights may also depend on 
// or can be defined as relationships between existing insights.
export interface Insight {
  name: string;
  insightType: InsightType;
  description?: string;

  relationshipModel: RelationshipModel;
  sourceInsights: Insight[]; // previous insights needed to form this insight
  targetInsights: Insight[]; // child insights that depend on this insight

  // used to calculate what percentage of the original data records were used to compute this insight
  // only return the source records used, not all source records
  // Do not return computed records! Source records only
  sourceRecords: () => Dataset[]; // the original source records used by this insight

  // generates a new dataset including the calculations important for this insight
  // Only return source records if no computation is needed to capture the insight (e.g., if doing filtering only)
  results: () => Dataset; // produces the final results of this insight

  complexityScore: () => { percentCoverageofSourceRecords: number, insightDepth: number, finalScore: number };
}

// used to track and evaluate the complexity of derived insights
export interface InsightComplexity {
  insight: Insight; // what insight is this for?
  percentageSourceRecords: () => number; // percentage of source records used by this insight
  insightDepth: () => number; // how many levels of insights were created to form this insight?
  insightCount: () => number; // how many insights were derived in order to form this insight?
  complexityScore: () => number; // what is the final complexity score for this insight?
}
