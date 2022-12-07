import * as pyxis from '../../../src/index';
import ZgraggenInsightExamples from './zgraggen_insight_examples.json'

// In this example, we will be translating insights from the Multiple Comparisons paper by Zgraggen et al.:
// Zgraggen, E., Zhao, Z., Zeleznik, R. and Kraska, T., 2018,
// April. Investigating the effect of the multiple
// comparisons problem in visual analysis. In Proceedings of
// the 2018 chi conference on human factors in computing
// systems (pp. 1-12).
// Please see the README in this folder for more details.

// loading the dataset
const sleep: pyxis.BaseDataset = pyxis.loadDataset(
  "sleep_generated.json",
  "Sleep"
);
console.log(sleep.records[0]);

