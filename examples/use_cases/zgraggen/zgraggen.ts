import * as pyxis from '../../../src/index';
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

// The first insight suggests that certain age groups get greater or fewer total hours of sleep. This can be represented using a data relationship over the respective input age groups and output hours_of_sleep. This requires creating a new attribute to group relevant records (i.e., a data transformation), and then training a data relationship to predict the result.
const meanSleepDiff = ZgraggenInsightExamples[0]
console.log(meanSleepDiff);

// update attribute names to match Vega transform syntax
function updatePredicate(attributes: pyxis.Attribute[], predicate: string) {
  return attributes.reduce((p: string, a: pyxis.Attribute) =>
    p.replaceAll(a.name, "datum."+a.name),predicate);
}

// TODO: write data transformation to create a new attribute using the filters
const inputs = sleep.records[0].attributes.filter(a => a.name === "age");
const dalt = updatePredicate(inputs, meanSleepDiff.dist_alt);
const dnull = updatePredicate(inputs, meanSleepDiff.dist_null);
console.log([dalt,dnull]);

let t: pyxis.transformation.VegaDataTransformation = {
  sources: [sleep], // sources lists all Dataset objects involved in the transformation
  ops: ["formula"], // ops lists all Vega transform operations that will be used to process the sources
  transforms: [ // transforms is the list of Vega Transform operations to execute, in order
    {
      "type": "formula", // the type of transform
      // a Vega expression to execute to distinguish age groups
      "expr": "if("+dalt+",'dist_alt',if("+dnull+",'dist_null',null))",
      "as": "age2"
    }
  ]
};
// We can execute the specified data transformation using the executeDataTransformation function from 'src/transformation/vegaTransform'
const sleepGrouped: pyxis.BaseDataset = pyxis.transformation.vega.executeDataTransformation(t);
// We can print one of the records from the BaseDataset object to confirm the results
for(let i = 0; i < 10; i++) {
  console.log(sleepGrouped.records[i]);
}

// TODO: Train a data relationship to predict hours_of_sleep using the new attribute as input

// TODO: show how insight could be tested. Maybe use calculation from the paper?

