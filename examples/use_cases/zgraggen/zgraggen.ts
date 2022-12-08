import * as pyxis from '../../../src/index';
import { compareGroups } from './mapping';
import ZgraggenInsightExamples from './zgraggen_insight_examples.json'

// TODO: Insight 1 ~ Insight 2 --> data relationship, Insight 3 easy relationship, Insight 4 easy transformation.

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

/*********** BEGIN FIRST "INSIGHT" ***********/
// The first insight suggests that certain age groups get greater or fewer
// total hours of sleep. However, this is computed by Zgraggen et al. using
// calculations and does not involve domain knowledge. Thus, we can represent
// these results using analytic knowledge involving data transformations only.

// get the insight object
const meanSleepDiff = ZgraggenInsightExamples[0];
console.log(meanSleepDiff);

// Extract the corresponding analytic knowledge nodes in Pyxis, one for the
// alternative hypothesis and one for the null hypothesis.
const msdAltKnowledge: pyxis.AnalyticKnowledgeNode = compareGroups(sleep,meanSleepDiff);
const msdNullKnowledge: pyxis.AnalyticKnowledgeNode = msdAltKnowledge.source[0];

// Get the results from the analytic knowledge nodes
const datasetAlt: pyxis.BaseDataset = msdAltKnowledge.results();
const datasetNull: pyxis.BaseDataset = msdAltKnowledge.results();

// Compute the answer: is the alternative hypothesis true compared to the null
// hypothesis?
const answers = datasetAlt.records[0].attributes.map(a =>
  datasetAlt.records[0].values[a.name] < datasetNull.records[0].values[a.name]);
// print the answer
answers.forEach((answer,i) => {
  console.log("alt",datasetAlt.records[0].attributes[i].name,
    "<","null",datasetAlt.records[0].attributes[i].name,"?",answer);
});
/*********** END FIRST "INSIGHT" ***********/


// TODO: Train a data relationship to predict hours_of_sleep using the new attribute as input

// TODO: show how insight could be tested. Maybe use calculation from the paper?

