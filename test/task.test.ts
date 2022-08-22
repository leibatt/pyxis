import * as path from 'path';
import { SimpleTaskNode } from '../src/task';
import { Concept, Instance, DomainKnowledgeNode } from '../src/knowledge/DomainKnowledge';
import { loadJsonFile } from '../src/load';
import { AttributeType, ValueType, BaseDataset, jsonObjectToDataset } from '../src/dataset';
import { AnalyticKnowledgeNode } from '../src/knowledge/AnalyticKnowledge';
import { InsightNode } from '../src/insight';
import { ArqueroDataTransformation, executeDataTransformation } from '../src/transformation/Arquero';

// dataset for testing purposes
const carsDataset = loadJsonFile(path.join(__dirname,"..","datasets","cars.json"));

describe('task.ts tests', () => {
  const cars: BaseDataset = jsonObjectToDataset(carsDataset,"cars");
  describe('SimpleTaskNode', () => {
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
      const dk = new DomainKnowledgeNode("n1",instance);
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
      const objective = new InsightNode("ob", [dk], [ak]); // just copy the insight
      const task = new SimpleTaskNode("st", objective, [insight]);
      const task2 = new SimpleTaskNode("st", objective, [insight],"description");
      expect(task.name).toBe("st");
      expect(task.insights[0].name).toBe("in");
      expect(task2.description).toBe("description");
    });
  });
});
