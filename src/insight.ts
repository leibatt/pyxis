import { DomainKnowledgeNode } from './knowledge/DomainKnowledge';
import { AnalyticKnowledgeNode } from './knowledge/AnalyticKnowledge';
import { GraphNode } from './GraphNode';

// used to track and evaluate the complexity of derived insight
export abstract class InsightComplexity {
  insight: InsightNode; // what insight is this for?

  constructor(insight: InsightNode) {
    this.insight = insight;
  }

  // how many levels of insights were created to form this insight?
  insightDepth(): number {
    return this.insight.sourceDepth();
  }

  // how many insights were derived in order to form this insight?
  insightCount(): number {
    return this.insight.sourceCount();
  }

  abstract percentageSourceRecords: () => number; // percentage of source records used by this insight

  abstract complexityScore: () => number; // what is the final complexity score for this insight?
}

// insight represents connecting analytic knowledge (evidence) with domain
// knowledge (concept/instance), as well as building on prior insights.
export class InsightNode extends GraphNode {
  description?: string;
  domainKnowledge: DomainKnowledgeNode[]; // only one node can be associated with this insight
  analyticKnowledge: AnalyticKnowledgeNode[]; // only one node can be associated with this insight

  // used to calculate and track the complexity of this particular evidence
  complexity?: () => InsightComplexity;

  constructor(name: string, domainKnowledge: DomainKnowledgeNode[],
    analyticKnowledge: AnalyticKnowledgeNode[],
    description?: string) {

    super(name);
    this.name = name;
    this.domainKnowledge = domainKnowledge;
    this.analyticKnowledge = analyticKnowledge;
    if(typeof description !== 'undefined') {
      this.description = description;
    }
    // TODO: instantiate complexity object
  }

  addTarget<NodeType extends InsightNode>(node: NodeType): void {
    super.addTarget(node);
  }

  addSource<NodeType extends InsightNode>(node: NodeType): void {
    super.addSource(node);
  }

  addRelated<NodeType extends InsightNode>(node: NodeType): void {
    super.addRelated(node);
  }
}
