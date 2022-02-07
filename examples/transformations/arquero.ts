import { desc, op } from 'arquero';
import { loadDataset, ValueType, BaseDataset } from '../../src/dataset';
import { ArqueroDataTransformation, executeDataTransformation } from '../../src/transformation/arquero';

// This example demonstrates how to create data transformation objects using our framework.
// These examples are backed by the Arquero library created at UW.
// You can find the original examples on Observable: https://observablehq.com/@uwdata/introducing-arquero

// We created JSON versions of the datasets used in the Observable introduction
// (see imports above).  You can import any JSON file automatically as a
// BaseDataset object from our framework using the jsonObjectToDataset function
// from 'src/datasets'.
const beers: BaseDataset = loadDataset("beers.json","beers");
const breweries: BaseDataset = loadDataset("breweries.json","breweries");

// This is an example of how we can apply a filter transformation using Arquero.
// t is a data transformation object. Data transformation objects can be linked
// to insights to specify what transformations applied prior to uncovering an
// insight
console.log("filter example: find all beers with 'hop' in the name");
let t: ArqueroDataTransformation = {
  sources: [beers], // sources lists all Dataset objects involved in the transformation
  ops: ["filter"], // ops lists all Arquero verbs that will be used to process the sources
  transforms: [ // transforms is the list of Arquero Verbs to execute, in order
    {
      op: "filter", // the specific verb to execute, which must be the actual function name in Arquero
      args: [(d: Record<string,ValueType>) => op.includes(op.lower(d.name), 'hop',0)] // the exact parameters to pass to the Arquero verb
    }
  ]
};
// We can execute the specified data transformation using the executeDataTransformation function from 'src/transformation/arquero'
const hoppyBeerNames: BaseDataset = executeDataTransformation(t);
// We can print one of the records from the BaseDataset object to confirm the results
console.log(hoppyBeerNames.records[0]);

// In this example, we show how to chain Arquero verbs together to perform more
// complex transformations. The ArqueroDataTransformation will automatically
// pass the output of one verb as input to the next, similar to how you would
// use method chaining for the normal Arquero syntax
console.log("group by example: group by beer style, calculate aggregate statistics, filter styles with too few examples, and sort in descending order by mean intensity");
t = {
  sources: [beers],
  ops: ["groupby","rollup","filter", "orderby"],
  transforms: [
    { // groupby verb, grouping by beer style
      op: "groupby",
      args: ["style"]
    },
    { // rollup verb, calculating aggregate statistics per beer style
      op: "rollup",
      args: [{
        mean_abv: (d: Record<string, number>) => op.mean(d.abv),
        mean_ibu: (d: Record<string, number>) => op.mean(d.ibu),
        mean_intensity: (d: Record<string, number>) => op.mean(3 * d.abv + op.log10(d.ibu) / 3),
        count: op.count()
      }]
    },
    {
      op: "filter", // filter verb, removing beer styles with less than 20 beers
      args: [(d: Record<string, number>) => d.count > 20]
    },
    {
      op: "orderby", // orderby verb, sorting in descending order by the mean_intensity aggregate statistic
      args: [desc("mean_intensity")]
    }
  ]
};
// we execute the ArqueroDataTransformation object
const beersGroupRollup: BaseDataset = executeDataTransformation(t);
// We check the results in the BaseDataset object
console.log(beersGroupRollup.records[0]);

// We handle joins a bit differently than other Arquero verbs, since they
// involve two rather than one data source. We include a new 'toJoin' parameter
// in the transforms objects to tell the ArqueroDataTransformation to join the
// current result with a separate data source.
console.log("join example: join the beers and breweries tables by brewery_id");
t = {
  sources: [beers,breweries], // list all sources for our records. The first source (beers) is assumed to be the lefthand source for the join
  ops: ["join"], // list all verbs for our records
  transforms: [
    {
      op: "join", // specify the join verb in Arquero
      args: [['brewery_id', 'brewery_id']], // specify the attributes to join by for the lefthand (beers) and righthand (breweries) data sources
      toJoin: breweries // specify the righthand data source to join with (this is a BaseDataset object)
    }
  ]
};
// Execute the join
const beersByBrewery: BaseDataset = executeDataTransformation(t);
// Check the results in the final BaseDataset object.
console.log(beersByBrewery.records[0]);

