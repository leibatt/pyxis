import { Concept, Instance, DomainKnowledgeNode } from '../../src/knowledge/DomainKnowledge';
import { AttributeType } from '../../src/dataset';

describe('DomainKnowledge.ts tests', () => {
  describe('Concept', () => {
    test('#constructor works', () => {
      const concept: Concept = new Concept(
        "test concept", // name
        [], // parentConcepts
        { // metadata 
          attributes: [
            {
              name: "a",
              attributeType: AttributeType.nominal
            }
          ],
          values: {"a": "test"},
          id: "d"
        }
      );
      expect(concept.name).toEqual("test concept");
    });
  });
  describe('Instance', () => {
    test('#constructor works', () => {
      const concept: Concept = new Concept(
        "test concept",
        [],
        {
          attributes: [
            {
              name: "a",
              attributeType: AttributeType.nominal
            }
          ],
          values: {"a": "test"},
          id: "d"
        }
      );
      const instance: Instance = new Instance(
        "test instance", // name
        concept, // coreConcept
        [], // relevantConcepts
        { // metadata
          attributes: [
            {
              name: "a",
              attributeType: AttributeType.nominal
            }
          ],
          values: {"a": "test"},
          id: "d"
        }
      );
      expect(instance.name).toEqual("test instance");
    });
  });
  describe('DomainKnowledgeNode', () => {
    const concept: Concept = new Concept(
      "test concept",
      [],
      {
        attributes: [
          {
            name: "a",
            attributeType: AttributeType.nominal
          }
        ],
        values: {"a": "test"},
        id: "d"
      }
    );
    const instance: Instance = new Instance(
      "ti1",
      concept,
      [],
      {
        attributes: [
          {
            name: "a",
            attributeType: AttributeType.nominal
          }
        ],
        values: {"a": "test1"},
        id: "0"
      }
    );
    const instance2: Instance = new Instance(
      "ti2",
      concept,
      [],
      {
        attributes: [
          {
            name: "a",
            attributeType: AttributeType.nominal
          }
        ],
        values: {"a": "test2"},
        id: "1"
      }
    );
    test('#constructor works', () => {
      const node1 = new DomainKnowledgeNode("n1",
        instance,
      );
      const node2 = new DomainKnowledgeNode("n2",
        instance2,
      );
      expect(node1.name).toEqual("n1");
      expect(node1.instance.name).toEqual("ti1");
      expect(node2.name).toEqual("n2");
      expect(node2.instance.name).toEqual("ti2");
    });
  });
});

