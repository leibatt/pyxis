# Pyxis
Pyxis is a specification language for defining visual analysis objectives, insights, and tasks in a programmatic way that is consistent with the academic literature.

## Research Team
This project is the work of [Prof. Leilani Battle](https://homes.cs.washington.edu/~leibatt/bio.html), Co-Director of the [UW Interactive Data Lab](http://idl.cs.washington.edu/), and Alvitta Ottley, Director of the [Visual Data Analysis Group](http://visualdata.wustl.edu/) at WashU.

## Citing Pyxis

This paper is currently under preparation, however we have a technical report available on [arXiv](https://arxiv.org/abs/2206.04767). If you would like to cite this work, please use the following:
```
@article{battle2022programmatic,
  title={A Programmatic Definition of Visualization Tasks, Insights, and Objectives},
  author={Battle, Leilani and Ottley, Alvitta},
  journal={arXiv preprint arXiv:2206.04767},
  year={2022}
}
```

## Setting Pyxis Up Locally

You will need to have both [TypeScript](https://www.typescriptlang.org/download) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) installed prior to setting up Pyxis. The following instructions assume you have already installed TypeScript and Yarn, and are currently in the Pyxis root folder.

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

## Testing Pyxis
Make sure the code builds and the tests run properly before trying the examples. To run tests and do linting run:
```
yarn test
```
All tests should pass. You may see a few warnings from eslint, but this is fine.

## Running the Examples

The codebase contains examples of how to specify all of the major components of Pyxis, including concepts, instances, domain knowledge nodes, data transformations, data relationships, analytic knowledge nodes, insights, and tasks.

To run any of our existing examples, you can do the following (assuming you are currently in the root folder for Pyxis):
```
node build-test/examples/[path to example].js
```

Here is an example of running the Amar et al. usage scenario from the paper:
```
node build-test/examples/use_cases/amar.js
```

