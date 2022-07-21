
// base class for domain knowledge, analytic knowledge, and insight nodes
export class GraphNode {
  name: string;
  target: GraphNode[]; // does this instance lead to other instances?
  source: GraphNode[]; // was this instance caused by other instances?
  related: GraphNode[]; // is this instance related to other instances?

  constructor(name: string) {
    this.name = name;
    this.target = [];
    this.source = [];
    this.related = [];
  }

  addTarget(node: GraphNode): void {
    if(node.name === this.name) {
        throw new Error("GraphNode cannot be its own target! "+ typeof(node) + ": " + node.name);
    }
    if(GraphNode.listContainsNode(this.source,node)) {
        throw new Error("GraphNode cannot be both source and target! "+ typeof(node) + ": " + node.name);
    }
    if(!GraphNode.listContainsNode(this.target,node)) {
      this.target.push(node);
      node.source.push(this);
    }
  }

  addSource(node: GraphNode): void {
    if(node.name === this.name) {
        throw new Error("GraphNode cannot be its own source! "+ typeof(node) + ": " + node.name);
    }
    if(GraphNode.listContainsNode(this.target,node)) {
        throw new Error("GraphNode cannot be both source and target! "+ typeof(node) + ": " + node.name);
    }
    if(!GraphNode.listContainsNode(this.source,node)) {
      this.source.push(node);
      node.target.push(this);
    }
  }

  addRelated(node: GraphNode): void {
    if(node.name === this.name) {
        throw new Error("GraphNode cannot be its own relation! "+ typeof(node) + ": " + node.name);
    }
    if(!GraphNode.listContainsNode(this.related,node)) {
      this.related.push(node);
      node.related.push(this);
    }
  }

  // Follow all the source paths and count unique source nodes.
  sourceCount(): number {
    const q1: GraphNode[] = [...this.source]; // shallow copy of source nodes
    // nodes we have already visited
    const visited: Set<string> = new Set<string>();
    while(q1.length > 0) {
      const n: GraphNode = q1.splice(0,1)[0];
      if(n.name === this.name) {
        throw new Error("GraphNode cannot be its own source! "+ typeof(n) + ": " + n.name);
      }
      if(!visited.has(n.name)) { // have we seen this one before?
        visited.add(n.name);
        n.source.forEach((n2: GraphNode) => { // check its sources
          if(!visited.has(n2.name)) {
            q1.push(n2);
          }
        });
      }
    }
    return visited.size;
  }

  // how long is this node's chain of source nodes?
  sourceDepth(): number {
    let q1: GraphNode[] = [...this.source]; // shallow copy of source nodes
    let q2: GraphNode[] = [];
    // nodes we have already visited
    const visited: Set<string> = new Set<string>();
    let depth = 1;
    while(q1.length > 0) {
      depth += 1; // we've reached a new level
      q1.forEach((n: GraphNode) => { // check each node
        if(n.name === this.name) {
          throw new Error("GraphNode cannot be its own source! "+ typeof(n) + ": " + n.name);
        }
        if(!visited.has(n.name)) { // have we seen this one before?
          visited.add(n.name); // we've seen it now
          n.source.forEach((n2: GraphNode) => { // check its sources
            q2.push(n2);
          });
        }
      });
      q1 = [...q2]; // swap q1 and q2
      q2 = [];
    }
    return depth;
  }

  // is this node in the list already?
  static listContainsNode(list: GraphNode[], target: GraphNode): boolean {
    for(let i = 0; i < list.length; i++) {
      if(target.name === list[i].name) {
        return true;
      }
    }
    return false;
  }
}

