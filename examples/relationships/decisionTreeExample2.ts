import * as pyxis from '../../src/index';

// This example uses the Baltimore crimes dataset.
// We can load the Baltimore crimes dataset from the /datasets folder as follows:
const baltimoreCrimes: pyxis.Dataset = pyxis.loadDataset("BPD_Part_1_Victim_Based_Crime_Data2.json","baltimoreCrimes");
console.log("first row of the baltimore crimes dataset:",baltimoreCrimes.records[0]);

// Now, we want to specify a new relationship model. Specifically, a decision
// tree classifier relationship. To do this, we just need to create a new
// decision tree relationship model object, and specify which data attributes
// are involved in the relationship:
const dtrm: pyxis.DecisionTreeClassificationRelationshipModel = new pyxis.DecisionTreeClassificationRelationshipModel(
  "baltimoreCrimes", // give the dataset a name, we can just call it baltimoreCrimes
  [ // input attributes, the attributes used to predict a certain outcome
    {
      name: "Inside/Outside", // Attribute name from the baltimoreCrimes dataset
      attributeType: pyxis.AttributeType.nominal // the type of attribute (quantitative, ordinal, or nominal)
    },
    {
      name: "Premise",
      attributeType: pyxis.AttributeType.nominal
    }
  ],
  { // output attribute, the outcome to be predicted
    name: "Description",
    attributeType: pyxis.AttributeType.nominal
  }
);
console.log("DT relationship input attributes:",dtrm.inputAttributes);
console.log("DT relationship output attribute:",dtrm.outputAttribute);

// Now, we can train the relationship model on some real data, so we can use it
// to infer the desired relationship. Here, we can train the model using the
// records of the baltimoreCrimes dataset:
console.log("training decision tree model...");
dtrm.train(baltimoreCrimes.records);

// With trained relationship models, we can actually use the model to predict
// output values. Here's an example of predicting the output value for the
// first record of the baltimoreCrimes dataset:
const prediction_result: pyxis.ValueType = dtrm.predict(baltimoreCrimes.records[0]);
console.log("record to predict:",baltimoreCrimes.records[0].values);
console.log("DT prediction:",prediction_result);

