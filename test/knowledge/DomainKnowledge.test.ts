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
  });
});

