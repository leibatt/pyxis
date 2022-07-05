import { Concept, Instance, DomainKnowledgeNode } from '../../src/knowledge/DomainKnowledge';
import { AttributeType } from '../../src/dataset';

describe('DomainKnowledge.ts tests', () => {
  describe('Concept', () => {
    test('can specify concepts', () => {
      const concept: Concept = {
        name: "test concept",
        parentConcepts: [],
        metadata: {
          attributes: [
            {
              name: "a",
              attributeType: AttributeType.nominal
            }
          ],
          values: {"a": "test"},
          id: "d"
        }
      };
      expect(concept.name).toEqual("test concept");
    });
  });
  describe('Instance', () => {
    test('can specify instances', () => {
      const concept: Concept = {
        name: "test concept",
        parentConcepts: [],
        metadata: {
          attributes: [
            {
              name: "a",
              attributeType: AttributeType.nominal
            }
          ],
          values: {"a": "test"},
          id: "d"
        }
      };
      const instance: Instance = {
        name: "test instance",
        coreConcept: concept,
        metadata: {
          attributes: [
            {
              name: "a",
              attributeType: AttributeType.nominal
            }
          ],
          values: {"a": "test"},
          id: "d"
        }
      };
      expect(instance.name).toEqual("test instance");
    });
  });
  describe('DomainKnowledgeNode', () => {
      const concept: Concept = {
        name: "test concept",
        parentConcepts: [],
        metadata: {
          attributes: [
            {
              name: "a",
              attributeType: AttributeType.nominal
            }
          ],
          values: {"a": "test"},
          id: "d"
        }
      };
      const instance: Instance = {
        name: "ti1",
        coreConcept: concept,
        metadata: {
          attributes: [
            {
              name: "a",
              attributeType: AttributeType.nominal
            }
          ],
          values: {"a": "test1"},
          id: "0"
        }
      };
      const instance2: Instance = {
        name: "ti2",
        coreConcept: concept,
        metadata: {
          attributes: [
            {
              name: "a",
              attributeType: AttributeType.nominal
            }
          ],
          values: {"a": "test2"},
          id: "1"
        }
      };
    test('#constructor works', () => {
      const node1 = new DomainKnowledgeNode(instance.name,
        instance.coreConcept,
        [],
        instance.metadata
      );
      const node2 = new DomainKnowledgeNode(instance2.name,
        instance2.coreConcept,
        [],
        instance2.metadata
      );
      expect(node1.name).toEqual("ti1");
      expect(node2.name).toEqual("ti2");
    });
    describe('#addTarget', () => {
      test('#addTarget adds node properly', () => {
        const node1 = new DomainKnowledgeNode(instance.name,
          instance.coreConcept,
          [],
          instance.metadata
        );
        const node2 = new DomainKnowledgeNode(instance2.name,
          instance2.coreConcept,
          [],
          instance2.metadata
        );
        node1.addTarget(node2);
        expect(node1.related).toHaveLength(0);
        expect(node1.target[0].name).toEqual("ti2");
        expect(node2.source[0].name).toEqual("ti1");
      });
      test('#addTarget ignores duplicates', () => {
        const node1 = new DomainKnowledgeNode(instance.name,
          instance.coreConcept,
          [],
          instance.metadata
        );
        const node2 = new DomainKnowledgeNode(instance2.name,
          instance2.coreConcept,
          [],
          instance2.metadata
        );
        node1.addTarget(node2);
        node1.addTarget(node2);
        expect(node1.target).toHaveLength(1);
        expect(node2.source).toHaveLength(1);
      });
    });
    describe('#addSource', () => {
      test('#addSource adds node properly', () => {
        const node1 = new DomainKnowledgeNode(instance.name,
          instance.coreConcept,
          [],
          instance.metadata
        );
        const node2 = new DomainKnowledgeNode(instance2.name,
          instance2.coreConcept,
          [],
          instance2.metadata
        );
        node1.addSource(node2);
        expect(node1.related).toHaveLength(0);
        expect(node1.source[0].name).toEqual("ti2");
        expect(node2.target[0].name).toEqual("ti1");
      });
      test('#addSource ignores duplicates', () => {
        const node1 = new DomainKnowledgeNode(instance.name,
          instance.coreConcept,
          [],
          instance.metadata
        );
        const node2 = new DomainKnowledgeNode(instance2.name,
          instance2.coreConcept,
          [],
          instance2.metadata
        );

        node1.addSource(node2);
        node1.addSource(node2);
        expect(node1.source).toHaveLength(1);
        expect(node2.target).toHaveLength(1);
      });
    });
    describe('#addRelated', () => {
      test('#addRelated adds node properly', () => {
        const node1 = new DomainKnowledgeNode(instance.name,
          instance.coreConcept,
          [],
          instance.metadata
        );
        const node2 = new DomainKnowledgeNode(instance2.name,
          instance2.coreConcept,
          [],
          instance2.metadata
        );

        node1.addRelated(node2);
        expect(node1.target).toHaveLength(0);
        expect(node1.source).toHaveLength(0);
        expect(node1.related[0].name).toEqual("ti2");
        expect(node2.related[0].name).toEqual("ti1");
      });
      test('#addRelated ignores duplicates', () => {
        const node1 = new DomainKnowledgeNode(instance.name,
          instance.coreConcept,
          [],
          instance.metadata
        );
        const node2 = new DomainKnowledgeNode(instance2.name,
          instance2.coreConcept,
          [],
          instance2.metadata
        );
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
});

