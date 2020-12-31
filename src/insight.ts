import {Dataset,DataRecord} from './dataset';
import {RelationshipModel} from './relationship';

// An insight represents some relationship within one or more datasets.
// However insights may also depend on 
// or can be defined as relationships between existing insights.
export interface Insight {
  name: string;
  description?: string;
  timestamp: Date; // to keep track of when the insight was created;

  relationshipModel: RelationshipModel;
  sourceInsights: Insight[]; // previous insights needed to form this insight
  targetInsights: Insight[]; // later insights that depend on this insight

  // used to calculate what percentage of the original data records were used to compute this insight
  // only return the source records used, not all source records
  // Do not return computed records! Source records only
  sourceRecordsUsed: () => {dataset: Dataset, recordsUsed: DataRecord[]}[]; // the original source records used by this insight
  allSourceRecords: () => Dataset[]; // all original source datasets available to this insight

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
