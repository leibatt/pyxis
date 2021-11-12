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

NOTE (11-11-2021): I set the "skipLibCheck" property to `true` in tsconfig.json because the apache arrow library throws a lot of errors (I think they do not adhere to the stricter type checking of newer typescript versions). I got this idea from the [arquero tsconfig.json file](https://github.com/uwdata/arquero/blob/master/tsconfig.json). Hopefully someday the arrow folks will fix it.
