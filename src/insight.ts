import { DomainKnowledgeNode } from './knowledge/DomainKnowledge';
import { AnalyticKnowledgeNode } from './knowledge/AnalyticKnowledge';

// insight represents connecting analytic knowledge (evidence) with domain
// knowledge (concept/instance).
export interface Insight {
  name: string;
  description: string;
  domainKnowledge: DomainKnowledgeNode[];
  analyticKnowledge: AnalyticKnowledgeNode[];

  sourceInsights: Insight[]; // previous insights needed to derive this insight
  targetInsights: Insight[]; // later insights derived (at least in part) from this insight

  // used to calculate and track the complexity of this particular evidence
  complexity?: () => InsightComplexity;
}

// used to track and evaluate the complexity of derived insight
export interface InsightComplexity {
  insight: Insight; // what insight is this for?
  percentageSourceRecords: () => number; // percentage of source records used by this insight
  insightDepth: () => number; // how many levels of insights were created to form this insight?
  insightCount: () => number; // how many insights were derived in order to form this insight?
  complexityScore: () => number; // what is the final complexity score for this insight?
}
