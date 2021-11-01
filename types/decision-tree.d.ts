
declare module 'decision-tree' {

  interface DTConfig {
    trainingSet: Record<string, string | number | boolean | bigint>[], 
    categoryAttr: string, 
    ignoredAttributes: string[]
  }

  class DecisionTree {
    constructor(builder: DTConfig);
    predict(toPredict: Record<string, string | number | boolean | bigint>): string | number;
  }

  class RandomForest {
    constructor(builder: DTConfig, number_of_trees: number);
    predict(toPredict: Record<string, string | number | boolean | bigint>): string | number;
  }

  export { DecisionTree, RandomForest };

}

