import * as pyxis from '../../../src/index';
import { compareGroups, linearCorrelation, rankHistogramBins } from './mapping';
import ZgraggenInsightExamples from './zgraggen_insight_examples.json'

// TODO: Insight 1 ~ Insight 2 --> data relationship, Insight 3 easy relationship, Insight 4 easy transformation.

// In this example, we will be translating insights from the Multiple Comparisons paper by Zgraggen et al.:
// Zgraggen, E., Zhao, Z., Zeleznik, R. and Kraska, T., 2018,
// April. Investigating the effect of the multiple
// comparisons problem in visual analysis. In Proceedings of
// the 2018 chi conference on human factors in computing
// systems (pp. 1-12).
// Please see the README in this folder for more details.

console.log("********* LOAD DATASET *********");

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

console.log("********* COMPARE GROUPS: MEAN *********");

// get the insight object
const meanHoursSleep = ZgraggenInsightExamples[0];
console.log(meanHoursSleep);

// Extract the corresponding analytic knowledge nodes in Pyxis, one for the
// alternative hypothesis and one for the null hypothesis.
const msdAltKnowledge: pyxis.AnalyticKnowledgeNode = compareGroups(sleep,meanHoursSleep,"Zgraggen-2018-meanHoursSleep");
const msdNullKnowledge: pyxis.AnalyticKnowledgeNode = msdAltKnowledge.source[0];

// Get the results from the analytic knowledge nodes
let datasetAlt: pyxis.BaseDataset = msdAltKnowledge.results();
let datasetNull: pyxis.BaseDataset = msdNullKnowledge.results();

// Compute the answer: is the alternative hypothesis true compared to the null
// hypothesis?
let answers = datasetAlt.records[0].attributes.map(a =>
  datasetAlt.records[0].values[a.name] < datasetNull.records[0].values[a.name]);
// print the answer
answers.forEach((answer,i) => {
  console.log("alt",datasetAlt.records[0].attributes[i].name,
    "<","null",datasetAlt.records[0].attributes[i].name,"?",answer);
});
/*********** END FIRST "INSIGHT" ***********/


/*********** BEGIN SECOND "INSIGHT" ***********/
// The second insight example from the Zgraggen et al. work suggests that a
// certain group has less variance in their quality of sleep compared to the
// entire sample population. This is again a comparison between an alternative
// hypothesis and null hypothesis.

console.log("********* COMPARE GROUPS: VARIANCE *********");

// get the insight object
const varianceSleepQuality = ZgraggenInsightExamples[1];
console.log(varianceSleepQuality);

// Extract the corresponding analytic knowledge nodes in Pyxis, one for the
// alternative hypothesis and one for the null hypothesis.
const vsqAltKnowledge: pyxis.AnalyticKnowledgeNode = compareGroups(sleep,varianceSleepQuality,"Zgraggen-2018-varianceSleepQuality");
const vsqNullKnowledge: pyxis.AnalyticKnowledgeNode = vsqAltKnowledge.source[0];

// Get the results from the analytic knowledge nodes
datasetAlt = vsqAltKnowledge.results();
datasetNull = vsqNullKnowledge.results();

// Compute the answer: is the alternative hypothesis true compared to the null
// hypothesis?
answers = datasetAlt.records[0].attributes.map(a =>
  datasetAlt.records[0].values[a.name] < datasetNull.records[0].values[a.name]);
// print the answer
answers.forEach((answer,i) => {
  console.log("alt",datasetAlt.records[0].attributes[i].name,
    "<","null",datasetAlt.records[0].attributes[i].name,"?",answer);
});

/*********** END SECOND "INSIGHT" ***********/

/*********** BEGIN THIRD "INSIGHT" ***********/
// The third insight example is assessing a linear correlation between two
// data attributes, which we can represent using a data relationship. Here, we
// use a linear regression model.

console.log("********* LINEAR REGRESSION *********");

// get the insight object
const hoursFitnessCorrelation = ZgraggenInsightExamples[2];
console.log(hoursFitnessCorrelation);

// compute the linear regression model
const hoursFitnessCorrKnowledge: pyxis.AnalyticKnowledgeNode = linearCorrelation(sleep,hoursFitnessCorrelation,"Zgraggen-2018-hoursFitnessCorr");
console.log(hoursFitnessCorrKnowledge);

/*********** END THIRD "INSIGHT" ***********/

/*********** BEGIN FOURTH "INSIGHT" ***********/
// The fourth insight example analyzes three bins within a histogram. We can
// calculate the histogram bins, filter for the relevant bins, and sort by
// count using a data transformation.

console.log("********* COMPUTE HISTOGRAM *********");

// get the insight object
const hoursSleepHistogram = ZgraggenInsightExamples[3];
console.log(hoursSleepHistogram);

const hoursSleepKnowledge: pyxis.AnalyticKnowledgeNode = rankHistogramBins(sleep,hoursSleepHistogram,
  "Zgraggen-2018-hoursSleepHistogramKnowledge", { "step": 1.0, "maxbins": 5 });

console.log(hoursSleepKnowledge);
console.log(hoursSleepKnowledge.results().records);


/*********** END FOURTH "INSIGHT" ***********/

