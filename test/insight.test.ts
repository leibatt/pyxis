import * as path from 'path';
import { Concept, DomainKnowledgeNode } from '../src/knowledge/DomainKnowledge';
import { loadJsonFile } from '../src/load';
import { AttributeType, ValueType, BaseDataset, jsonObjectToDataset } from '../src/dataset';
import { AnalyticKnowledgeNode } from '../src/knowledge/AnalyticKnowledge';
import { InsightNode } from '../src/insight';
import { ArqueroDataTransformation, executeDataTransformation } from '../src/transformation/Arquero';

// dataset for testing purposes
const carsDataset = loadJsonFile(path.join(__dirname,"..","datasets","cars.json"));

describe('insight.ts tests', () => {
  const cars: BaseDataset = jsonObjectToDataset(carsDataset,"cars");
  describe('InsightNode', () => {
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
      const dk = new DomainKnowledgeNode(
        "n1",
        [concept],
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
      const t: ArqueroDataTransformation = { // transformation for testing
        sources: [cars],
        ops: ["filter"],
        transforms: [
          {
            op: "filter",
            args: [(d: Record<string,ValueType>) => d.Horsepower >= 200]
          }
        ]
      };
      const ak = new AnalyticKnowledgeNode("akn_t", // name
        Date.now(), // timestamp
        t, // transformation,
        null, // relationshipModel
        () => executeDataTransformation(t) // results
      );
      const insight = new InsightNode("in", [dk], [ak]);
      expect(insight.name).toBe("in");
      expect(insight.analyticKnowledge[0].name).toBe("akn_t");
    });
  });
});
