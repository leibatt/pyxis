import { DataRecord } from '../dataset';
import { KnowledgeNode } from './KnowledgeNode';

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
  coreConcept: Concept; // main Concept type associated with this instance
  relevantConcepts?: Concept[]; // other relevant concepts !== ctype
  data?: DataRecord; // associated attributes for this instance and their values
}

export class DomainKnowledgeNode extends KnowledgeNode {
  instance: Instance;

  constructor(name: string, instance: Instance) {
    super(name);
    this.instance = instance;
    this.id = this.instance.id;
  }
}

