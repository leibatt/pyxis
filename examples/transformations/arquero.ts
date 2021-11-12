import { desc, op } from 'arquero';
import * as beersRaw from '../../datasets/beers.json';
import * as breweriesRaw from '../../datasets/breweries.json';
import { ValueType, BaseDataset, jsonObjectToDataset } from '../../src/dataset';
import { ArqueroDataTransformation, executeDataTransformation } from '../../src/transformation/arquero';

// examples from https://observablehq.com/@uwdata/introducing-arquero

// datasets from the Observable notebook
const beers: BaseDataset = jsonObjectToDataset(beersRaw,"beers");
const breweries: BaseDataset = jsonObjectToDataset(breweriesRaw,"beers");

console.log("filter example: find all beers with 'hop' in the name");
let t: ArqueroDataTransformation = {
  sources: [beers],
  ops: ["filter"],
  transforms: [
    {
      op: "filter",
      args: [(d: Record<string,ValueType>) => op.includes(op.lower(d.name), 'hop',0)]
    }
  ]
};
const hoppyBeerNames: BaseDataset = executeDataTransformation(t);
console.log(hoppyBeerNames.records[0]);

console.log("group by example: group by beer style, calculate aggregate statistics, filter styles with too few examples, and sort in descending order by mean intensity");
t = {
  sources: [beers],
  ops: ["groupby","rollup","filter", "orderby"],
  transforms: [
    {
      op: "groupby",
      args: ["style"]
    },
    {
      op: "rollup",
      args: [{
        mean_abv: (d: Record<string, number>) => op.mean(d.abv),
        mean_ibu: (d: Record<string, number>) => op.mean(d.ibu),
        mean_intensity: (d: Record<string, number>) => op.mean(3 * d.abv + op.log10(d.ibu) / 3),
        count: op.count()
      }]
    },
    {
      op: "filter",
      args: [(d: Record<string, number>) => d.count > 20]
    },
    {
      op: "orderby",
      args: [desc("mean_intensity")]
    }
  ]
};
const beersGroupRollup: BaseDataset = executeDataTransformation(t);
console.log(beersGroupRollup.records[0]);

console.log("join example: join the beers and breweries tables by brewery_id");
t = {
  sources: [beers,breweries],
  ops: ["join"],
  transforms: [
    {
      op: "join",
      args: [['brewery_id', 'brewery_id']],
      toJoin: breweries
    }
  ]
};
const beersByBrewery: BaseDataset = executeDataTransformation(t);
console.log(beersByBrewery.records[0]);

