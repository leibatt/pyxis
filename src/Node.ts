
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

  // how long is this node's chain of source nodes?
  sourceDepth(): number {
    let q1: Node[] = [...this.source]; // shallow copy of source nodes
    let q2: Node[] = [];
    // nodes we have already visited
    const visited: Set<string> = new Set<string>();
    let depth = 1;
    while(q1.length > 0) {
      depth += 1; // we've reached a new level
      q1.forEach((n: Node) => { // check each node
        if(n.name === this.name) {
          throw new Error("Node cannot be its own source! "+ typeof(n) + ": " + n.name);
        }
        if(visited.has(n.name)) { // have we seen this one before?
          return;
        }
        visited.add(n.name); // we've seen it now
        n.source.forEach((n2: Node) => { // check its sources
          q2.push(n2);
        });
      });
      q1 = [...q2]; // swap q1 and q2
      q2 = [];
    }
    return depth;
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

