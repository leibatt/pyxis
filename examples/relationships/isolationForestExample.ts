import * as pyxis from '../../src/index';

// This example uses the palmerpenguins dataset, originally from here:
// https://allisonhorst.github.io/palmerpenguins/
// We can load the penguins dataset from the /datasets folder as follows:
const penguins: pyxis.Dataset = pyxis.loadDataset("penguins.json","penguins");
console.log("first row of penguins dataset:",penguins.records[0]);

// Now, we want to specify a new relationship model. Specifically, an isolation
// forest relationship, which we can use to detect outliers.  To do this, we
// just need to create a new isolation forest relationship model object, and
// specify which data attributes are involved in the relationship:
const attributes: pyxis.Attribute[] = [ // input attributes, the attributes used to predict a certain outcome
  {
    name: "Flipper Length (mm)", // Attribute name from the penguins dataset
    attributeType: pyxis.AttributeType.quantitative // the type of attribute (quantitative, ordinal, or nominal)
  },
  {
    name: "Culmen Length (mm)", // also known as bill length
    attributeType: pyxis.AttributeType.quantitative
  }
];
let ifrm: pyxis.IsolationForestRelationshipModel = new pyxis.IsolationForestRelationshipModel(
  "pengiuns - predict outliers",
  attributes
);
console.log("Isolation forest relationship input attributes:",ifrm.inputAttributes);

// Now, we can train the relationship model on some real data, so we can use it
// to infer the desired relationship. Here, we can train the model using the
// records of the penguins dataset:
ifrm.train(penguins.records);

// With trained relationship models, we can actually use the model to predict
// output values. Here's an example of predicting the output value for one
// record of the penguins dataset:
const prediction_result: pyxis.ValueType = ifrm.predict(penguins.records[185]);
// If instances return a score very close to 1, then they are definitely anomalies.
// If instances have a score much smaller than 0.5, then they are quite safe to be regarded as normal instances.
// If all the instances return a score ≈ 0.5, then the entire sample does not really have any distinct anomaly.
console.log("record to predict:",penguins.records[185].values);
console.log("Isolation forest prediction (values close to 1.0 are likely outliers):",prediction_result);


// Note that in this case, the isolation forest does not seem to find any
// outliers!  for the purposes of this example, we are going to now
// intentionally include an outlier to test the model.  To do this, we will
// modify an existing record to have outlier values.
penguins.records[0].values["Culmen Length (mm)"] = -10;
penguins.records[0].values["Flipper Length (mm)"] = -200;

ifrm = new pyxis.IsolationForestRelationshipModel(
  "pengiuns - predict deliberate outliers",
  attributes
);
ifrm.train(penguins.records);
console.log("modified record to predict:",penguins.records[0].values);
console.log("Isolation forest prediction (values close to 1.0 are likely outliers):",ifrm.predict(penguins.records[0]));
console.log("unmodified record to predict:",penguins.records[1].values);
console.log("Isolation forest prediction (values close to 1.0 are likely outliers):",ifrm.predict(penguins.records[1]));
