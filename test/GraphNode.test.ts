import { GraphNode } from '../src/GraphNode';

describe('GraphNode.ts tests', () => {
  test('#constructor works', () => {
    const node: GraphNode = new GraphNode("n");
    expect(node.name).toBe("n");
  });
  describe('#sourceCount', () => {
    const node1 = new GraphNode("n");
    const node2 = new GraphNode("n2");
    node2.addSource(node1);
    const node3 = new GraphNode("n3");
    node3.addSource(node2);
    test('#sourceCount returns 0 for empty node', () => {
      expect(node1.sourceCount()).toBe(0);
    });
    test('#sourceCount returns 1 for one source node', () => {
      expect(node2.sourceCount()).toBe(1);
    });
    test('#sourceCount returns 2 with source of source', () => {
      expect(node3.sourceCount()).toBe(2);
    });
    test('#sourceCount returns 2 with two total source nodes', () => {
      const node4 = new GraphNode("n4");
      node4.addSource(node1);
      node4.addSource(node2);
      expect(node4.sourceCount()).toBe(2);
    });
  });
  describe('#sourceDepth', () => {
    const node1 = new GraphNode("n");
    const node2 = new GraphNode("n2");
    node2.addSource(node1);
    const node3 = new GraphNode("n3");
    node3.addSource(node2);
    test('#sourceDepth returns 1 for empty node', () => {
      expect(node1.sourceDepth()).toBe(1);
    });
    test('#sourceDepth returns 2 for one source node', () => {
      expect(node2.sourceDepth()).toBe(2);
    });
    test('#sourceDepth returns 3 with source of source', () => {
      expect(node3.sourceDepth()).toBe(3);
    });
    test('#sourceDepth returns 3 with source of source and empty node as sources', () => {
      const node4 = new GraphNode("n4");
      node4.addSource(node1);
      node4.addSource(node2);
      expect(node4.sourceDepth()).toBe(3);
    });
  });
  describe('#addTarget', () => {
    test('#addTarget adds node properly', () => {
      const node1 = new GraphNode("n");
      const node2 = new GraphNode("n2");
      node1.addTarget(node2);
      expect(node1.related).toHaveLength(0);
      expect(node1.target[0].name).toBe("n2");
      expect(node2.source[0].name).toBe("n");
    });
    test('#addTarget ignores duplicates', () => {
      const node1 = new GraphNode("n");
      const node2 = new GraphNode("n2");
      node1.addTarget(node2);
      node1.addTarget(node2);
      expect(node1.target).toHaveLength(1);
      expect(node2.source).toHaveLength(1);
    });
    test('#addTarget throws error when node is its own target', () => {
      const node1 = new GraphNode("n");
      expect(() => { node1.addTarget(node1); }).toThrow();
    });
    test('#addTarget throws error when node is already source', () => {
      const node1 = new GraphNode("n");
      const node2 = new GraphNode("n2");
      node1.addSource(node2);
      expect(() => { node1.addTarget(node2); }).toThrow();
    });
  });
  describe('#addSource', () => {
    test('#addSource adds node properly', () => {
      const node1 = new GraphNode("n");
      const node2 = new GraphNode("n2");
      node1.addSource(node2);
      expect(node1.related).toHaveLength(0);
      expect(node1.source[0].name).toBe("n2");
      expect(node2.target[0].name).toBe("n");
    });
    test('#addSource ignores duplicates', () => {
      const node1 = new GraphNode("n");
      const node2 = new GraphNode("n2");
      node1.addSource(node2);
      node1.addSource(node2);
      expect(node1.source).toHaveLength(1);
      expect(node2.target).toHaveLength(1);
    });
    test('#addSource throws error when node is its own source', () => {
      const node1 = new GraphNode("n");
      expect(() => { node1.addSource(node1); }).toThrow();
    });
    test('#addSource throws error when node is already target', () => {
      const node1 = new GraphNode("n");
      const node2 = new GraphNode("n2");
      node1.addTarget(node2);
      expect(() => { node1.addSource(node2); }).toThrow();
    });
  });
  describe('#addRelated', () => {
    test('#addRelated adds node properly', () => {
      const node1 = new GraphNode("n");
      const node2 = new GraphNode("n2");
      node1.addRelated(node2);
      expect(node1.target).toHaveLength(0);
      expect(node1.source).toHaveLength(0);
      expect(node1.related[0].name).toBe("n2");
      expect(node2.related[0].name).toBe("n");
    });
    test('#addRelated ignores duplicates', () => {
      const node1 = new GraphNode("n");
      const node2 = new GraphNode("n2");
      node1.addRelated(node2);
      node1.addRelated(node2);
      expect(node1.source).toHaveLength(0);
      expect(node2.source).toHaveLength(0);
      expect(node1.target).toHaveLength(0);
      expect(node2.target).toHaveLength(0);
      expect(node1.related).toHaveLength(1);
      expect(node2.related).toHaveLength(1);
    });
    test('#addRelated throws error when node is its own relation', () => {
      const node1 = new GraphNode("n");
      expect(() => { node1.addRelated(node1); }).toThrow();
    });
  });
});
