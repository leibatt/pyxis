
// base class for knowledge nodes (domain and analytic)
export class KnowledgeNode {
  name: string;
  id: number | string;
  targetKnowledge: KnowledgeNode[]; // does this instance lead to other instances?
  sourceKnowledge: KnowledgeNode[]; // was this instance caused by other instances?
  relatedKnowledge: KnowledgeNode[]; // is this instance related to other instances?

  constructor(name: string) {
    this.name = name;
    this.id = this.name;
    this.targetKnowledge = [];
    this.sourceKnowledge = [];
    this.relatedKnowledge = [];
  }

  addTargetKnowledge(node: KnowledgeNode): void {
    if(!KnowledgeNode.listContainsNode(this.targetKnowledge,node)) {
      this.targetKnowledge.push(node);
      node.sourceKnowledge.push(this);
    }
  }

  addSourceKnowledge(node: KnowledgeNode): void {
    if(!KnowledgeNode.listContainsNode(this.sourceKnowledge,node)) {
      this.sourceKnowledge.push(node);
      node.targetKnowledge.push(this);
    }
  }

  addRelatedKnowledge(node: KnowledgeNode): void {
    if(!KnowledgeNode.listContainsNode(this.relatedKnowledge,node)) {
      this.relatedKnowledge.push(node);
      node.relatedKnowledge.push(this);
    }
  }

  // is this node in the list already?
  static listContainsNode(list: KnowledgeNode[], target: KnowledgeNode): boolean {
    for(let i = 0; i < list.length; i++) {
      if(target.id === list[i].id) {
        return true;
      }
    }
    return false;
  }
}

