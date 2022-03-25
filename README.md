# Pyxis

This is the accompanying TypeScript codebase for VIS Submission \# 1318: A Programmatic Definition of Visualization Tasks, Insights, and Objectives.

This codebase represents the Pyxis specification language. Pyxis is designed to support declarative specification of visual analysis insights, objectives, and tasks.

# Installation and Setup

You will need to have both [TypeScript](https://www.typescriptlang.org/download) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) installed prior to setting up Pyxis. The following instructions assume you are currently in the Pyxis root folder.

To install all package dependencies for Pyxis run:
```
yarn
```

Assuming the installation was successful, to build everything and copy the datasets to the build folder run:
```
yarn build
``` 
To build the source code only run:
``` 
yarn build-src
``` 
To build the examples only run:
``` 
yarn build-examples
``` 
To copy the datasets to the build folder run:
``` 
yarn build-datasets
``` 

## Resolving Build Issue with  MultivariateLinearRegression

NOTE: You may see an issue with building `MultivariateLinearRegression`, which is from an external package. To fix it do the following (from [here](https://github.com/mljs/regression-multivariate-linear/issues/15)):

Add the following line to the end of the `regression-multivariate-linear.d.ts` file (located at `node\_modules/ml-regression-multivariate-linear/`):
```
export default MultivariateLinearRegression;
```
then remove this line in the MultivariateLinearRegression Class in the same file:
```
export = MultivariateLinearRegression;
```

# Testing Pyxis
Make sure the code builds and the tests run properly before trying the examples. To run tests and do linting run:
```
yarn test
```
All tests should pass. You may see a few warnings from eslint, but this is fine.

# Running the Examples

The codebase contains examples of how to specify all of the major components of Pyxis, including concepts, instances, domain knowledge nodes, data transformations, data relationships, analytic knowledge nodes, insights, and tasks.

To run any of our existing examples, you can do the following (assuming you are currently in the root folder for Pyxis):
```
node build/examples/[path to example].js
```

Here is an example of running the Amar et al. usage scenario from the paper:
```
node build/examples/use_cases/amar.js
```
