import { Node } from '../src/Node';

describe('Node.ts tests', () => {
  test('#constructor works', () => {
    const node: Node = new Node("n");
    expect(node.name).toEqual("n");
  });
  describe('#addTarget', () => {
    test('#addTarget adds node properly', () => {
      const node1 = new Node("n");
      const node2 = new Node("n2");
      node1.addTarget(node2);
      expect(node1.related).toHaveLength(0);
      expect(node1.target[0].name).toEqual("n2");
      expect(node2.source[0].name).toEqual("n");
    });
    test('#addTarget ignores duplicates', () => {
      const node1 = new Node("n");
      const node2 = new Node("n2");
      node1.addTarget(node2);
      node1.addTarget(node2);
      expect(node1.target).toHaveLength(1);
      expect(node2.source).toHaveLength(1);
    });
  });
  describe('#addSource', () => {
    test('#addSource adds node properly', () => {
      const node1 = new Node("n");
      const node2 = new Node("n2");
      node1.addSource(node2);
      expect(node1.related).toHaveLength(0);
      expect(node1.source[0].name).toEqual("n2");
      expect(node2.target[0].name).toEqual("n");
    });
    test('#addSource ignores duplicates', () => {
      const node1 = new Node("n");
      const node2 = new Node("n2");
      node1.addSource(node2);
      node1.addSource(node2);
      expect(node1.source).toHaveLength(1);
      expect(node2.target).toHaveLength(1);
    });
  });
  describe('#addRelated', () => {
    test('#addRelated adds node properly', () => {
      const node1 = new Node("n");
      const node2 = new Node("n2");
      node1.addRelated(node2);
      expect(node1.target).toHaveLength(0);
      expect(node1.source).toHaveLength(0);
      expect(node1.related[0].name).toEqual("n2");
      expect(node2.related[0].name).toEqual("n");
    });
    test('#addRelated ignores duplicates', () => {
      const node1 = new Node("n");
      const node2 = new Node("n2");
      node1.addRelated(node2);
      node1.addRelated(node2);
      expect(node1.source).toHaveLength(0);
      expect(node2.source).toHaveLength(0);
      expect(node1.target).toHaveLength(0);
      expect(node2.target).toHaveLength(0);
      expect(node1.related).toHaveLength(1);
      expect(node2.related).toHaveLength(1);
    });
  });
});
