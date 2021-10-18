
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

/*
// Training set
var data = 
    [{person: 'Homer', hairLength: 0, weight: 250, age: 36, sex: 'male'},
     {person: 'Marge', hairLength: 10, weight: 150, age: 34, sex: 'female'},
     {person: 'Otto', hairLength: 10, weight: 180, age: 38, sex: 'male'},
     {person: 'Krusty', hairLength: 6, weight: 200, age: 45, sex: 'male'}];

// Configuration
var config = {
    trainingSet: data, 
    categoryAttr: 'sex', 
    ignoredAttributes: ['person']
};

// Building Decision Tree
var decisionTree = new dt.DecisionTree(config);

// Building Random Forest
var numberOfTrees = 3;
var randomForest = new dt.RandomForest(config, numberOfTrees);

// Testing Decision Tree and Random Forest
var comic = {person: 'Comic guy', hairLength: 8, weight: 290, age: 38};

var decisionTreePrediction = decisionTree.predict(comic);
var randomForestPrediction = randomForest.predict(comic);
*/
