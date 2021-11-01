declare module 'ml-knn' {

  interface KNNConfig {
    k?: bigint; // number of nearest neighbors
    distance?: (attributes: number[]) => number; // distance function
  }

  class KNN {
    constructor(dataset: number[][], labels: number[], options?: KNNConfig);
    predict(dataset: number[][]): number[];
    predict(dataset: number[]): number;
  }

  export = KNN;
}

