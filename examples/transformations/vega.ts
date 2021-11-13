import * as beersRaw from '../../datasets/beers.json';
import * as breweriesRaw from '../../datasets/breweries.json';
import { BaseDataset, jsonObjectToDataset } from '../../src/dataset';
import { VegaDataTransformation, executeDataTransformation } from '../../src/transformation/vegaTransform';

// This example demonstrates how to create data transformation objects using
// our framework.  These examples are backed by the Vega Dataflow, created at
// UW. We access the Vega Dataflow indirectly through Vega.  You can find the
// original Arquero examples on Observable:
// https://observablehq.com/@uwdata/introducing-arquero

// We created JSON versions of the datasets used in the Observable Arquero
// introduction (see imports above).  You can import any JSON file
// automatically as a BaseDataset object from our framework using the
// jsonObjectToDataset function from 'src/datasets'.
const beers: BaseDataset = jsonObjectToDataset(beersRaw,"beers");
const breweries: BaseDataset = jsonObjectToDataset(breweriesRaw,"breweries");

// This is an example of how we can apply a filter transformation using Vega.
// t is a data transformation object. Data transformation objects can be linked
// to insights to specify what transformations applied prior to uncovering an
// insight
console.log("filter example: find all beers with 'hop' in the name");
let t: VegaDataTransformation = {
  sources: [beers], // sources lists all Dataset objects involved in the transformation
  ops: ["filter"], // ops lists all Vega transform operations that will be used to process the sources
  transforms: [ // transforms is the list of Vega Transform operations to execute, in order
    {
      "type": "filter", // the type of transform
      "expr": "indexof(lower(datum.name),'hop') >= 0" // a Vega expression to execute to evaluate the filter
    }
  ]
};
// We can execute the specified data transformation using the executeDataTransformation function from 'src/transformation/vegaTransform'
const hoppyBeerNames: BaseDataset = executeDataTransformation(t);
// We can print one of the records from the BaseDataset object to confirm the results
console.log(hoppyBeerNames.records[0]);

// In this example, we show how to chain Vega transform operations together to
// perform more complex transformations.
console.log("group by example: group by beer style, calculate aggregate statistics, filter styles with too few examples, and sort in descending order by mean intensity");
t = {
  sources: [beers],
  ops: ["groupby","rollup","filter", "orderby"],
  transforms: [
    { // calculate beer intensity
      "type": "formula",
      "as": "intensity",
      "expr": "3 * datum.abv + log(datum.ibu) / 3" // NOTE: should be log10 but not supported in Vega
    },
    { // calculate aggregate statistics per beer style
      "type": "aggregate",
      "groupby": ["style"],
      "fields": ["abv","ibu","intensity","abv"],
      "ops": ["mean","mean","mean","count"],
      "as": ["mean_abv","mean_ibu","mean_intensity","count"]
    },
    {
      "type": "filter", // filter out beer styles with less than 20 beers
      "expr": "datum.count > 20"
    },
    {
      "type": "collect", // sort in descending order by the mean_intensity aggregate statistic
      "sort": {
        "field": ["mean_intensity"],
        "order": ["descending"]
      }
    }
  ]
};
// we execute the VegaDataTransformation object
const beersGroupRollup: BaseDataset = executeDataTransformation(t);
// We check the results in the BaseDataset object
console.log(beersGroupRollup.records[0]);

/*
// FINISH FIXING  THIS!!!
// The only Join operator in Vega is the Lookup operator.
// We handle joins a bit differently than other Vega verbs, since they
// involve two rather than one data source. We include a new 'toJoin' parameter
// in the transforms objects to tell the VegaDataTransformation to join the
// current result with a separate data source.
console.log("join example: join the beers and breweries tables by brewery_id");
t = {
  sources: [beers,breweries], // list all sources for our records. The first source (beers) is assumed to be the lefthand source for the join
  ops: ["join"], // list all verbs for our records
  transforms: [
    {
      op: "join", // specify the join verb in Vega
      args: [['brewery_id', 'brewery_id']], // specify the attributes to join by for the lefthand (beers) and righthand (breweries) data sources
      toJoin: breweries // specify the righthand data source to join with (this is a BaseDataset object)
    }
  ]
};
// Execute the join
const beersByBrewery: BaseDataset = executeDataTransformation(t);
// Check the results in the final BaseDataset object.
console.log(beersByBrewery.records[0]);

*/
