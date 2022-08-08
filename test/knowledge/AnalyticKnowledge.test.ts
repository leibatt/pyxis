import * as path from 'path';
import { loadJsonFile } from '../../src/load';
import { AttributeType, ValueType, BaseDataset, jsonObjectToDataset } from '../../src/dataset';
import { AnalyticKnowledgeNode } from '../../src/knowledge/AnalyticKnowledge';
import { RelationshipModel } from '../../src/relationship/RelationshipModel';
import { LinearRegressionRelationshipModel } from '../../src/relationship/LinearRegressionRelationshipModel';
import { ArqueroDataTransformation, executeDataTransformation } from '../../src/transformation/Arquero';

// dataset for testing purposes
const carsDataset = loadJsonFile(path.join(__dirname,"..","..","datasets","cars.json"));

describe('AnalyticKnowledge.ts tests', () => {
  const cars: BaseDataset = jsonObjectToDataset(carsDataset,"cars");
  describe('AnalyticKnowledgeNode', () => {
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

    // relationship model for testing
    const rm: RelationshipModel = new LinearRegressionRelationshipModel(
        "lm(horsepower ~ mpg)",
        [ // input attributes
          {
            name: "Horsepower",
            attributeType: AttributeType.quantitative
          }
        ],
        { // output attribute
          name: "Miles_per_Gallon",
          attributeType: AttributeType.quantitative
        }
      );
    rm.train(cars.records);
    test('#constructor works', () => {
      const node1 = new AnalyticKnowledgeNode("akn_t", // name
        Date.now(), // timestamp
        t, // transformation,
        null, // relationshipModel
        () => executeDataTransformation(t) // results
      );
      const node2 = new AnalyticKnowledgeNode("akn_rm",
        Date.now(),
        null,
        rm,
        () => cars // just return the cars dataset
      );
      expect(node1.name).toBe("akn_t");
      expect(node2.name).toBe("akn_rm");
    });
  });
});
