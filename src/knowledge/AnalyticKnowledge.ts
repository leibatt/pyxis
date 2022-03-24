import { DataTransformation } from '../transformation/DataTransformation';
import { BaseDataset,DataRecord } from '../dataset';
import { RelationshipModel } from '../relationship/RelationshipModel';
import { KnowledgeNode } from './KnowledgeNode';

// Evidence represents some relationship within one or more datasets.
// However analytic knowledge may also depend on 
// or can be defined as relationships between existing analytic knowledge.
export interface AnalyticKnowledge {
  name: string;
  description?: string;
  timestamp: number; // to keep track of when the analytic knowledge was created;

  transformation: DataTransformation; // how to pre-process the data to uncover the desired analytic knowledge.
                                      // also includes references to the source datasets!
  relationshipModel: RelationshipModel; // the data relationship captured by the analytic knowledge, if applicable

  // used to calculate what percentage of the original data records were used to compute this analytic knowledge
  // only return the source records used, not all source records
  // Do not return computed records! Source records only
  sourceRecordsUsed?: () => {dataset: BaseDataset, recordsUsed: DataRecord[]}[]; // the original source records used by this analytic knowledge

  // generates a new dataset including the calculations important for this analytic knowledge
  // Only return source records if no computation is needed to capture the analytic knowledge (e.g., if doing filtering only)
  results: () => BaseDataset; // produces the final results of applying transformation and relationship

  // used to calculate and track the complexity of this particular analytic knowledge
  complexity?: () => AnalyticKnowledgeNodeComplexity;
}

export class AnalyticKnowledgeNode extends KnowledgeNode {
  analyticKnowledge: AnalyticKnowledge;

  constructor(name: string, analyticKnowledge: AnalyticKnowledge) {
    super(name);
    this.analyticKnowledge = analyticKnowledge;
    this.id = this.analyticKnowledge.name;
  }
}

// used to track and evaluate the complexity of derived analytic knowledge
// will be useful for computing insight complexity (see 'insight.ts')
export interface AnalyticKnowledgeNodeComplexity {
  analyticKnowledgeNode: AnalyticKnowledgeNode; // what analytic knowledge node is this for?
  percentageSourceRecords: () => number; // percentage of source records used by this analytic knowledge
  depth: () => number; // how many levels of analytic knowledge were created to form this analytic knowledge?
  count: () => number; // how many analytic knowledge were derived in order to form this analytic knowledge?
  complexityScore: () => number; // what is the final complexity score for this analytic knowledge?
}


