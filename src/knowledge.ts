import { DataRecord } from './dataset';

// The structure for user domain knowledge was adapted from the work by Gotz,
// Zhou and Aggarwal: Gotz, D., Zhou, M.X. and Aggarwal, V., 2006, October.
// Interactive visual synthesis of analytic knowledge. In 2006 IEEE Symposium
// On Visual Analytics Science And Technology (pp. 51-58). IEEE.

// handy type for categorizing the types of knowledge important for the analysis session
export type KnowledgeType = string;

// concepts are essentially new types
export interface Concept {
  name: string;
  ctype: KnowledgeType; // main knowledge type associated with this concept
  parentTypes: Concept[]; // the parent concepts that this concept is derived from
  data?: DataRecord; // associated attributes for this concept and their values
}

// instances are instantiations of concepts
export interface Instance {
  name: string;
  id: number | string;
  coreConcept: Concept; // main Conceept type associated with this instance
  relevantConcepts?: Concept[]; // other relevant concepts !== ctype
  data?: DataRecord; // associated attributes for this instance and their values
}

export class DomainKnowledgeNode {
  name: string;
  instance: Instance;
  causes: DomainKnowledgeNode[]; // does this instance lead to other instances?
  causedBy: DomainKnowledgeNode[]; // was this instance caused by other instances?
  relatedTo: DomainKnowledgeNode[]; // is this instance related to other instances?

  constructor(name: string, instance: Instance) {
    this.name = name;
    this.instance = instance;
    this.causes = [];
    this.causedBy = [];
    this.relatedTo = [];
  }

  addCauses(node: DomainKnowledgeNode): void {
    if(!DomainKnowledgeNode.listContainsNode(this.causes,node)) {
      this.causes.push(node);
      node.causedBy.push(this);
    }
  }

  addCausedBy(node: DomainKnowledgeNode): void {
    if(!DomainKnowledgeNode.listContainsNode(this.causedBy,node)) {
      this.causedBy.push(node);
      node.causes.push(this);
    }
  }

  addRelatedTo(node: DomainKnowledgeNode): void {
    if(!DomainKnowledgeNode.listContainsNode(this.relatedTo,node)) {
      this.relatedTo.push(node);
      node.relatedTo.push(this);
    }
  }

  // is this node in the list already?
  static listContainsNode(list: DomainKnowledgeNode[], target: DomainKnowledgeNode): boolean {
    for(let i = 0; i < list.length; i++) {
      if(target.instance.id === list[i].instance.id) {
        return true;
      }
    }
    return false;
  }
}

