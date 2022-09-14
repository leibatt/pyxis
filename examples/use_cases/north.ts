import { op, bin } from 'arquero';
import * as pyxis from '../../src/index';

// In this example, we will be recreating the rents dataset exploration
// scenario proposed by North, focusing on data transformations and
// relationships:
// North, C., 2006. Toward measuring visualization insight. IEEE computer
// graphics and applications, 26(3), pp.6-9.

// To investigate evidence, we will use the rents dataset in this example (see
// README for source details).
const hudRents: pyxis.BaseDataset = pyxis.loadDataset("HUD_FY2021_50_County.json","HUD Rents 2021");

console.log("calculate maximum and minimum rents for 2 bedroom homes");
const aggregateTransformation: pyxis.transformation.ArqueroDataTransformation = {
  sources: [hudRents],
  ops: ["rollup"], // list all verbs for our records
  transforms: [
    {
      op: "rollup",
      args: [{
        min_rent_2br: (d: Record<string, number>) => op.min(d["rent50_2"]),
        max_rent_2br: (d: Record<string, number>) => op.max(d["rent50_2"])
      }]
    }
  ]
};
// We store the extrema as our first evidence node
const ev1: pyxis.AnalyticKnowledgeNode = new pyxis.AnalyticKnowledgeNode(
  "north2006-1", // name
  Date.now(), // timestamp
  aggregateTransformation, // transformation
  null, // relationshipModel
  () => pyxis.transformation.arquero.executeDataTransformation(aggregateTransformation), // results
  "Minimum and maximum rents for 2 bedroom homes. North 2006 evidence example 1" // description
);
const minMaxRents: pyxis.BaseDataset = ev1.results();
minMaxRents.sources = [hudRents];
console.log(minMaxRents.records[0]);


// A more complex relationship is to train a normal distribution relationship
// using the rent dataset as input. This is an example of a univariate
// data relationship.
console.log("\n\ncreate data relationship to estimate a normal distribution over rents");
const nmm: pyxis.NormalRelationshipModel = new pyxis.NormalRelationshipModel(
  "normal distribution - HUD dataset - 2br only",
  hudRents.records[0].attributes.filter((a: pyxis.Attribute) => a.name === "rent50_2")[0]
);
nmm.train(hudRents.records);
console.log("mean:",nmm.model.mean(),"stdev:",nmm.model.stdev());
// We store the final relationship as our second piece of evidence.
const ev2: pyxis.AnalyticKnowledgeNode = new pyxis.AnalyticKnowledgeNode(
  "north2006-2", // name
  Date.now(), // timestamp
  null, // transformation
  nmm, // relationshipModel
  () => hudRents, // results
  "Normal distribution calculated from 2br rents. North 2006 evidence example 2" // description: 
);

console.log("\n\ncalculate binned aggregation over rents for 2 bedroom homes");
const binnedTransformation: pyxis.transformation.ArqueroDataTransformation = {
  sources: [hudRents],
  ops: ["groupby","rollup","orderby"], // list all verbs for our records
  transforms: [
    {
      op: "groupby",
      args: [{
        "rent50_2_binned": bin("rent50_2", {"maxbins": 30})
      }]
    },
    {
      op: "rollup",
      args: [{
        count: op.count()
      }]
    },
    {
      op: "orderby",
      args: ["rent50_2_binned"]
    }
  ]
};
// We store the joined table as our second evidence node, and link it to the first.
const ev3: pyxis.AnalyticKnowledgeNode = new pyxis.AnalyticKnowledgeNode(
  "north2006-3", // name
  Date.now(), // timestamp
  binnedTransformation, // transformation
  null, // relationshipModel
  () => pyxis.transformation.arquero.executeDataTransformation(binnedTransformation), // results
  "Histogram of rents for 2 bedroom homes. North 2006 evidence example 3" // description
);
const binnedRents: pyxis.BaseDataset = ev3.results();
binnedRents.sources = [hudRents];
console.log(binnedRents.records[0].attributes);
console.log(binnedRents.records.map(r => r.values));

