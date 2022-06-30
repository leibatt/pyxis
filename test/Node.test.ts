import { BaseDataset, loadDataset, ValueType } from '../src/dataset';
import { AnalyticKnowledge, AnalyticKnowledgeNode } from '../src/knowledge/AnalyticKnowledge';
import { ArqueroDataTransformation, executeDataTransformation } from '../src/transformation/Arquero';

describe('AnalyticKnowledge.ts tests', () => {
  describe('AnalyticKnowledgeNode', () => {
    const cars: BaseDataset = loadDataset("cars.json","cars");
    const filterTransformation: ArqueroDataTransformation = {
      sources: [cars], // sources lists all Dataset objects involved in the transformation
      ops: ["filter"],
      transforms: [
        {
          op: "filter",
          args: [(d: Record<string,ValueType>) => d.Horsepower > 130]
        }
      ]
    };
    test('#constructor works', () => {
      const _ak: AnalyticKnowledge = {
        name: "_ak",
        description: "analytic knowledge test",
        timestamp: Date.now(),
        transformation: filterTransformation,
        relationshipModel: null,
        results: () => executeDataTransformation(filterTransformation)
      };

      const ak: AnalyticKnowledgeNode = new AnalyticKnowledgeNode(_ak);
      expect(ak.name).toEqual("ak");
      expect(ak.analyticKnowledge.name).toEqual(_ak.name);
    });
  });
});
