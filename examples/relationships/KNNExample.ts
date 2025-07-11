import * as pyxis from '../../src/index';

// This example uses the cars dataset, originally from the vega-datasets
// repository: https://github.com/vega/vega-datasets/blob/next/data/cars.json
// We can load the cars dataset from the /datasets folder as follows:
const cars: pyxis.Dataset = pyxis.loadDataset("cars.json","cars");
console.log("first row of cars dataset:",cars.records[0]);

// Now, we want to specify a new relationship model. Specifically, a KNN
// classifier relationship. To do this, we just need to create a new KNN
// relationship model object, and specify which data attributes are involved in
// the relationship:
const knnrm: pyxis.KNNRelationshipModel = new pyxis.KNNRelationshipModel(
  "cars", // give the dataset a name, we can just call it cars
  [ // input attributes, the attributes used to predict a certain outcome
    {
      name: "Weight_in_lbs", // Attribute name from the cars dataset
      attributeType: pyxis.AttributeType.quantitative // the type of attribute (quantitative, ordinal, or nominal)
    },
    {
      name: "Horsepower",
      attributeType: pyxis.AttributeType.quantitative
    }
  ],
  { // output attribute, the outcome to be predicted
    name: "Cylinders",
    attributeType: pyxis.AttributeType.quantitative
  }
);
console.log("KNN relationship input attributes:",knnrm.inputAttributes);
console.log("KNN relationship output attribute:",knnrm.outputAttribute);

// Now, we can train the relationship model on some real data, so we can use it
// to infer the desired relationship. Here, we can train the model using the
// records of the cars dataset:
knnrm.train(cars.records);

// With trained relationship models, we can actually use the model to predict
// output values. Here's an example of predicting the output value for the
// second record of the cars dataset:
const prediction_result: pyxis.ValueType = knnrm.predict(cars.records[1]);
console.log("record to predict:",cars.records[1].values);
console.log("KNN prediction:",prediction_result);

