import { DataRecord } from '../dataset';
import { GraphNode } from '../GraphNode';

// The structure for user domain knowledge was adapted from the work by Gotz,
// Zhou and Aggarwal: Gotz, D., Zhou, M.X. and Aggarwal, V., 2006, October.
// Interactive visual synthesis of analytic knowledge. In 2006 IEEE Symposium
// On Visual Analytics Science And Technology (pp. 51-58). IEEE.

// concepts are entity classes
export class Concept {
  name: string; // also acts as a unique identifier
  parentConcepts: Concept[]; // the parent concepts that this concept is derived from
  metadata?: DataRecord; // associated metadata attributes for this concept and their values

  constructor(name: string, parentConcepts: Concept[] = [], metadata?: DataRecord) {
    this.name = name;
    this.parentConcepts = parentConcepts;
    if(typeof metadata !== 'undefined') {
      this.metadata = metadata
    }
  }
}

// Domain Knowledge Nodes are instantiations of concepts
export class DomainKnowledgeNode extends GraphNode {
  coreConcept: Concept; // main Concept type associated with this instance
  relevantConcepts?: Concept[]; // other relevant concepts !== coreConcept
  metadata?: DataRecord; // associated metadata attributes for this instance and their values

  constructor(name: string, coreConcept: Concept, relevantConcepts?: Concept[], metadata?: DataRecord) {
    super(name);
    this.name = name;

    this.coreConcept = coreConcept;
    if(typeof relevantConcepts !== 'undefined') {
      this.relevantConcepts = relevantConcepts;
    }
    if(typeof metadata !== 'undefined') {
      this.metadata = metadata
    }
  }

  addTarget<NodeType extends DomainKnowledgeNode>(node: NodeType): void {
    super.addTarget(node);
  }

  addSource<NodeType extends DomainKnowledgeNode>(node: NodeType): void {
    super.addSource(node);
  }

  addRelated<NodeType extends DomainKnowledgeNode>(node: NodeType): void {
    super.addRelated(node);
  }
}

