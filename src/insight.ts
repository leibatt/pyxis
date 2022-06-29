import { DomainKnowledgeNode } from './knowledge/DomainKnowledge';
import { AnalyticKnowledgeNode } from './knowledge/AnalyticKnowledge';
import { Node } from './Node';

// insight represents connecting analytic knowledge (evidence) with domain
// knowledge (concept/instance).
export interface Insight {
  name: string; // also used as an unique identifier
  description?: string;
  domainKnowledge: DomainKnowledgeNode; // only one node can be associated with this insight
  analyticKnowledge: AnalyticKnowledgeNode; // only one node can be associated with this insight
}

// used to track and evaluate the complexity of derived insight
export interface InsightComplexity {
  insight: Insight; // what insight is this for?
  percentageSourceRecords: () => number; // percentage of source records used by this insight
  insightDepth: () => number; // how many levels of insights were created to form this insight?
  insightCount: () => number; // how many insights were derived in order to form this insight?
  complexityScore: () => number; // what is the final complexity score for this insight?
}

// helps to keep track of relationships between insights
export class InsightNode extends Node {
  insight: Insight;
  // used to calculate and track the complexity of this particular evidence
  complexity?: () => InsightComplexity;

  constructor(name: string, insight: Insight, complexity?: () => InsightComplexity) {
    super(name);
    this.insight = insight;
    if(typeof complexity !== 'undefined') {
      this.complexity = complexity;
    }
    this.name = this.insight.name;
  }
}
