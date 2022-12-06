import { Concept, DomainKnowledgeNode } from '../../src/knowledge/DomainKnowledge';
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
      expect(concept.name).toBe("test concept");
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
    test('#constructor works', () => {
      const node1 = new DomainKnowledgeNode(
        "n1",
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
      const node2 = new DomainKnowledgeNode(
        "n2",
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
      expect(node1.name).toBe("n1");
      expect(node1.coreConcept.name).toBe("test concept");
      expect(node2.name).toBe("n2");
      expect(node2.coreConcept.name).toBe("test concept");
    });
  });
});

