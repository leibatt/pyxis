
declare module 'vega-statistics' {
  interface Distribution {
    sample: () => number;
    pdf: (value: number) => number;
    cdf: (value: number) => number;
    icdf?: (value: number) => number;
  }

  function randomKDE(values: number[]): Distribution;
  function randomNormal(mean?: number, stdev?: number): Distribution;
  function randomLogNormal(mean?: number, stdev?: number): Distribution;
  function randomUniform(min?: number, max?: number): Distribution;
  function randomInteger(min?: number, max: number): Distribution;
  function randomMixture(distributions: Distribution[], weights: number[]): Distribution;

  export { Distribution, randomKDE, randomNormal, randomLogNormal, randomUniform, randomInteger, randomMixture };
}