import { DataTransformation } from './transformation/DataTransformation';
import { Dataset,DataRecord } from './dataset';
import { RelationshipModel } from './relationship/relationshipModel';

// Evidence represents some relationship within one or more datasets.
// However evidence may also depend on 
// or can be defined as relationships between existing evidence.
export interface Evidence {
  name: string;
  description?: string;
  timestamp: Date; // to keep track of when the evidence was created;

  sourceEvidence: Evidence[]; // previous evidence needed to derive this evidence
  targetEvidence: Evidence[]; // later evidence derived (at least in part) from this evidence

  transformation: DataTransformation; // how to pre-process the data before building the relationship
                                      // also includes references to the source datasets!
  relationshipModel: RelationshipModel;

  // used to calculate what percentage of the original data records were used to compute this evidence
  // only return the source records used, not all source records
  // Do not return computed records! Source records only
  sourceRecordsUsed: () => {dataset: Dataset, recordsUsed: DataRecord[]}[]; // the original source records used by this evidence

  // generates a new dataset including the calculations important for this evidence
  // Only return source records if no computation is needed to capture the evidence (e.g., if doing filtering only)
  results: () => Dataset; // produces the final results of applying transformation and relationship

  // used to calculate and track the complexity of this particular evidence
  complexity?: () => EvidenceComplexity;
}

// used to track and evaluate the complexity of derived evidence
// will be useful for computing insight complexity (see 'insight.ts')
export interface EvidenceComplexity {
  evidence: Evidence; // what evidence is this for?
  percentageSourceRecords: () => number; // percentage of source records used by this evidence
  evidenceDepth: () => number; // how many levels of evidence were created to form this evidence?
  evidenceCount: () => number; // how many evidence were derived in order to form this evidence?
  complexityScore: () => number; // what is the final complexity score for this evidence?
}

