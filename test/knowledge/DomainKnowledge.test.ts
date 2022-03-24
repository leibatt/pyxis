import { Concept, Instance, DomainKnowledgeNode } from '../../src/knowledge/DomainKnowledge';
import { AttributeType } from '../../src/dataset';

describe('DomainKnowledge.ts tests', () => {
  enum ConceptType {
    test1 = "test1",
    test2 = "test2",
    test3 = "test3"
  }

  describe('Concept', () => {
    test('can specify concepts', () => {
      const concept: Concept = {
        name: "test concept",
        ctype: ConceptType.test1,
        parentTypes: [],
        data: {
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
        ctype: ConceptType.test1,
        parentTypes: [],
        data: {
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
        id: "test instance",
        name: "test instance",
        coreConcept: concept,
        data: {
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
        ctype: ConceptType.test1,
        parentTypes: [],
        data: {
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
        id: "ti1",
        name: "test instance",
        coreConcept: concept,
        data: {
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
        id: "ti2",
        name: "another test instance",
        coreConcept: concept,
        data: {
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
      const node1 = new DomainKnowledgeNode("n1", instance);
      const node2 = new DomainKnowledgeNode("n2", instance2);
      expect(node1.name).toEqual("n1");
      expect(node1.id).toEqual(instance.id);
      expect(node2.name).toEqual("n2");
      expect(node2.id).toEqual(instance2.id);
    });
    describe('#addTargetKnowledge', () => {
      test('#addTargetKnowledge adds node properly', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addTargetKnowledge(node2);
        expect(node1.relatedKnowledge).toHaveLength(0);
        expect(node1.targetKnowledge[0].id).toEqual("ti2");
        expect(node2.sourceKnowledge[0].id).toEqual("ti1");
      });
      test('#addTargetKnowledge ignores duplicates', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addTargetKnowledge(node2);
        node1.addTargetKnowledge(node2);
        expect(node1.targetKnowledge).toHaveLength(1);
        expect(node2.sourceKnowledge).toHaveLength(1);
      });
    });
    describe('#addSourceKnowledge', () => {
      test('#addSourceKnowledge adds node properly', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addSourceKnowledge(node2);
        expect(node1.relatedKnowledge).toHaveLength(0);
        expect(node1.sourceKnowledge[0].id).toEqual("ti2");
        expect(node2.targetKnowledge[0].id).toEqual("ti1");
      });
      test('#addSourceKnowledge ignores duplicates', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addSourceKnowledge(node2);
        node1.addSourceKnowledge(node2);
        expect(node1.sourceKnowledge).toHaveLength(1);
        expect(node2.targetKnowledge).toHaveLength(1);
      });
    });
    describe('#addRelatedKnowledge', () => {
      test('#addRelatedKnowledge adds node properly', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addRelatedKnowledge(node2);
        expect(node1.targetKnowledge).toHaveLength(0);
        expect(node1.sourceKnowledge).toHaveLength(0);
        expect(node1.relatedKnowledge[0].id).toEqual("ti2");
        expect(node2.relatedKnowledge[0].id).toEqual("ti1");
      });
      test('#addRelatedKnowledge ignores duplicates', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addRelatedKnowledge(node2);
        node1.addRelatedKnowledge(node2);
        expect(node1.sourceKnowledge).toHaveLength(0);
        expect(node2.sourceKnowledge).toHaveLength(0);
        expect(node1.targetKnowledge).toHaveLength(0);
        expect(node2.targetKnowledge).toHaveLength(0);
        expect(node1.relatedKnowledge).toHaveLength(1);
        expect(node2.relatedKnowledge).toHaveLength(1);
      });
    });
  });
});

