import { DataRecord } from '../dataset';
import { Node } from '../Node';

// The structure for user domain knowledge was adapted from the work by Gotz,
// Zhou and Aggarwal: Gotz, D., Zhou, M.X. and Aggarwal, V., 2006, October.
// Interactive visual synthesis of analytic knowledge. In 2006 IEEE Symposium
// On Visual Analytics Science And Technology (pp. 51-58). IEEE.

// concepts are essentially entity classes
export interface Concept {
  name: string; // also acts as a unique identifier
  parentTypes: Concept[]; // the parent concepts that this concept is derived from
  metadata?: DataRecord; // associated metadata attributes for this concept and their values
}

// instances are instantiations of concepts
export interface Instance {
  name: string; // also acts as a unique identifier
  coreConcept: Concept; // main Concept type associated with this instance
  relevantConcepts?: Concept[]; // other relevant concepts !== coreConcept
  metadata?: DataRecord; // associated metadata attributes for this instance and their values
}

export class DomainKnowledgeNode extends Node {
  instance: Instance;

  constructor(name: string, instance: Instance) {
    super(name);
    this.instance = instance;
    this.name = this.instance.name;
  }
}

