declare module 'ml-naivebayes' {
  import { Matrix } from 'ml-matrix';

  class GaussianNB {
    constructor(reload?: boolean, model?: { means: number[], calculateProbabilities: number[][] });
    // NOTE: assumes at least two input attributes are used for training/testing
    train(trainingSet: Matrix | number[][], trainingLabels: Matrix | number[]): void;
    predict(dataset: Matrix | number[][]): number[];
  }

  export { GaussianNB };
}

