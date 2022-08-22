import { InsightNode } from './insight';
import { GraphNode } from './GraphNode';

export class SimpleTaskNode extends GraphNode {
    description?: string;
    objective: InsightNode; // objective driving the task
    insights: InsightNode[]; // insights gained from the task

  constructor(name: string, objective: InsightNode, insights: InsightNode[], description?: string) {
    super(name);
    this.objective = objective;
    this.insights = [...insights];
    if(typeof description !== 'undefined') {
      this.description = description;
    }
  }
}
