import { Concept, Instance, DomainKnowledgeNode } from '../src/knowledge';
import { AttributeType } from '../src/dataset';

describe('knowledge.ts tests', () => {
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
      expect(node2.name).toEqual("n2");
    });
    describe('#addCauses', () => {
      test('#addCauses adds node properly', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addCauses(node2);
        expect(node1.relatedTo).toHaveLength(0);
        expect(node1.causes[0].instance.id).toEqual("ti2");
        expect(node2.causedBy[0].instance.id).toEqual("ti1");
      });
      test('#addCauses ignores duplicates', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addCauses(node2);
        node1.addCauses(node2);
        expect(node1.causes).toHaveLength(1);
        expect(node2.causedBy).toHaveLength(1);
      });
    });
    describe('#addCausedBy', () => {
      test('#addCausedBy adds node properly', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addCausedBy(node2);
        expect(node1.relatedTo).toHaveLength(0);
        expect(node1.causedBy[0].instance.id).toEqual("ti2");
        expect(node2.causes[0].instance.id).toEqual("ti1");
      });
      test('#addCausedBy ignores duplicates', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addCausedBy(node2);
        node1.addCausedBy(node2);
        expect(node1.causedBy).toHaveLength(1);
        expect(node2.causes).toHaveLength(1);
      });
    });
    describe('#addRelatedTo', () => {
      test('#addRelatedTo adds node properly', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addRelatedTo(node2);
        expect(node1.causes).toHaveLength(0);
        expect(node1.causedBy).toHaveLength(0);
        expect(node1.relatedTo[0].instance.id).toEqual("ti2");
        expect(node2.relatedTo[0].instance.id).toEqual("ti1");
      });
      test('#addRelatedTo ignores duplicates', () => {
        const node1 = new DomainKnowledgeNode("n1", instance);
        const node2 = new DomainKnowledgeNode("n2", instance2);
        node1.addRelatedTo(node2);
        node1.addRelatedTo(node2);
        expect(node1.causedBy).toHaveLength(0);
        expect(node2.causedBy).toHaveLength(0);
        expect(node1.causes).toHaveLength(0);
        expect(node2.causes).toHaveLength(0);
        expect(node1.relatedTo).toHaveLength(1);
        expect(node2.relatedTo).toHaveLength(1);
      });
    });
  });
});

