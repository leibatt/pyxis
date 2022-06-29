
// base class for domain knowledge, analytic knowledge, and insight nodes
export class Node {
  name: string;
  target: Node[]; // does this instance lead to other instances?
  source: Node[]; // was this instance caused by other instances?
  related: Node[]; // is this instance related to other instances?

  constructor(name: string) {
    this.name = name;
    this.target = [];
    this.source = [];
    this.related = [];
  }

  addTarget(node: Node): void {
    if(!Node.listContainsNode(this.target,node)) {
      this.target.push(node);
      node.source.push(this);
    }
  }

  addSource(node: Node): void {
    if(!Node.listContainsNode(this.source,node)) {
      this.source.push(node);
      node.target.push(this);
    }
  }

  addRelated(node: Node): void {
    if(!Node.listContainsNode(this.related,node)) {
      this.related.push(node);
      node.related.push(this);
    }
  }

  // is this node in the list already?
  static listContainsNode(list: Node[], target: Node): boolean {
    for(let i = 0; i < list.length; i++) {
      if(target.name === list[i].name) {
        return true;
      }
    }
    return false;
  }
}

