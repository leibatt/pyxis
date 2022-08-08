import { loadDataset } from '../../src/load';
import { AttributeType, Dataset } from '../../src/dataset';
import { KDERelationshipModel } from '../../src/relationship/KDERelationshipModel';

// This example uses the palmerpenguins dataset, originally from here:
// https://allisonhorst.github.io/palmerpenguins/
// We can load the penguins dataset from the /datasets folder as follows:
const penguins: Dataset = loadDataset("penguins.json","penguins");
console.log("first row of penguins dataset:",penguins.records[0]);

// Now, we want to specify a new relationship model. Specifically, we want to
// simulate a univariate relationship, i.e., simulate the distribution of a
// specific data attribute. We will try using the kernel density estimation
// distribution model from the 'vega-statistics' package.  To do this, we
// just need to create a new KDE relationship model object, and
// specify which data attribute is involved in the relationship:
const kdem: KDERelationshipModel = new KDERelationshipModel(
  "pengiuns - simulate flipper length",
  { // input attribute to simulate
    name: "Flipper Length (mm)", // Attribute name from the penguins dataset
    attributeType: AttributeType.quantitative // the type of attribute (quantitative, ordinal, or nominal)
  }
);
console.log("KDE relationship input attribute:",kdem.inputAttribute);

// Now, we can train the relationship model on some real data, so we can use it
// to simulate the desired relationship. Here, we can train the model using the
// records of the penguins dataset:
kdem.train(penguins.records);

// With trained relationship model, we can it to simulate possible values from
// the target distribution.  Here's an example of simulating a flipper length
// value from the penguins dataset:
for(let i = 0; i < 10; i++) {
  console.log("[" + i + "] simulated value for flipper legnth:",kdem.simulate());
}

