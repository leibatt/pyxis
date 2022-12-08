import { DataTransformation } from '../transformation/DataTransformation';
import { BaseDataset,DataRecord } from '../dataset';
import { RelationshipModel } from '../relationship/RelationshipModel';
import { GraphNode } from '../GraphNode';

// Evidence represents some relationship within one or more datasets.
// However analytic knowledge may also depend on 
// or can be defined as relationships between existing analytic knowledge.
export class AnalyticKnowledgeNode extends GraphNode {
  target: AnalyticKnowledgeNode[]; // does this instance lead to other instances?
  source: AnalyticKnowledgeNode[]; // was this instance caused by other instances?
  related: AnalyticKnowledgeNode[]; // is this instance related to other instances?
  timestamp: number; // to keep track of when the analytic knowledge was created;
  transformation: DataTransformation; // how to pre-process the data to uncover the desired analytic knowledge.
                                      // also includes references to the source datasets!
  relationshipModel: RelationshipModel; // the data relationship captured by the analytic knowledge, if applicable

  // generates a new dataset including the calculations important for this analytic knowledge
  // Only return source records if no computation is needed to capture the analytic knowledge (e.g., if doing filtering only)
  results: () => BaseDataset; // produces the final results of applying transformation and relationship
  description?: string;

  // used to calculate what percentage of the original data records were used to compute this analytic knowledge
  // only return the source records used, not all source records
  // Do not return computed records! Source records only
  sourceRecordsUsed?: () => {dataset: BaseDataset, recordsUsed: DataRecord[]}[]; // the original source records used by this analytic knowledge

  // used to calculate and track the complexity of this particular analytic knowledge
  complexity?: () => AnalyticKnowledgeNodeComplexity;

  constructor(name: string, timestamp: number, transformation: DataTransformation, relationshipModel: RelationshipModel,
    results: () => BaseDataset, description?: string) {
    super(name);
    this.name = name;
    this.timestamp = timestamp;
    this.transformation = transformation;
    this.relationshipModel = relationshipModel;
    this.results = results;
    if(typeof description !== 'undefined') {
      this.description = description;
    }
  }

  addTarget<NodeType extends AnalyticKnowledgeNode>(node: NodeType): void {
    super.addTarget(node);
  }

  addSource<NodeType extends AnalyticKnowledgeNode>(node: NodeType): void {
    super.addSource(node);
  }

  addRelated<NodeType extends AnalyticKnowledgeNode>(node: NodeType): void {
    super.addRelated(node);
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


