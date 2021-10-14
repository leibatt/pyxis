declare module 'ml-cart' {
  import { Matrix, MatrixTransposeView } from 'ml-matrix';

  export interface DTOptions {
    gainFunction?: string;
    splitFunction?: string;
    minNumSamples?: number;
    maxDepth?: number;
  }

  export interface TNOptions extends DTOptions {
    kind: string;
    gainThreshold: number;
  }

  class TreeNode {
    constructor(options: TNOptions);
    bestSplit(XTranspose: Matrix, y: number[]): Record<string, number>;
    split(x: number[], y: number, splitValue: number): Record<string, number[]>;
    featureSplit(x: number[], y: number): number[];
    calculatePrediction(y: number[]): void;
    train(X: Matrix, y: number[], currentDepth: number, parentGain: number): void;
    classify(row: number[]): number | number[];
    setNodeParameters(node: TreeNode): void;
  }

  export interface DTClassifier {
    options: DTOptions;
    root: TreeNode;
    name: string;
  }

  export interface DTRegression {
    options: DTOptions;
    root: TreeNode;
    name: string;
  }

  class DecisionTreeClassifier {
    constructor(options: DTOptions, model: DTClassifier);
    train(trainingSet: Matrix | MatrixTransposeView | number[][], trainingLabels: number[]): void;
    predict(toPredict: Matrix | MatrixTransposeView | number[][]): number[];
    toJSON(): DTClassifier;
    static load(model: DTClassifier): DecisionTreeClassifier;
  }

  class DecisionTreeRegression {
    constructor(options: DTOptions, model: DTRegression);
    train(trainingSet: Matrix | MatrixTransposeView | number[][], trainingValues: number[]): void;
    predict(toPredict: number[][]): number[];
    toJSON(): DTRegression;
    static load(model: DTRegression): DecisionTreeRegression;
  }

  export { DecisionTreeClassifier, DecisionTreeRegression, TreeNode };
}



