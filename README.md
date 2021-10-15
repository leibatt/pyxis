# formalizing-vis-tasks
code repository for the formalizing visualization tasks research project.

to install dependencies use `yarn`

to build the codebase use `yarn build`

to run tests and do linting use `yarn test`

NOTE: there is an issue with building `MultivariateLinearRegression`. To fix it do the following (from [here](https://github.com/mljs/regression-multivariate-linear/issues/15)):

Add
```
export default MultivariateLinearRegression;
```
at the end of the regression-multivariate-linear.d.ts file located at node\_modules/ml-regression-multivariate-linear/

then remove the line in MultivariateLinearRegression Class
```
export = MultivariateLinearRegression;
```

NOTE (10-14-2021): the [ml-cart](https://github.com/mljs/decision-tree-cart) package has a bug where it makes the same incorrect prediction for every input! See [this issue](https://github.com/mljs/random-forest/issues/32) for more details.
