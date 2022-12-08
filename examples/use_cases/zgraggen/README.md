# Recreating Zgraggen et al. Insights

This folder contains recreations of insights from the Zgraggen multiple comparisons paper:
* Zgraggen, E., Zhao, Z., Zeleznik, R. and Kraska, T., 2018, April.
 Investigating the effect of the multiple comparisons problem in visual
 analysis. In Proceedings of the 2018 chi conference on human factors in
 computing systems (pp. 1-12).

We had to create our own sleep dataset to recreate these insights. Our data is
available in `sleep_sample.csv`. We used the code referenced in Zgraggen et al.
(the Macau project, see `data_generator.py` from
[this repository](https://github.com/zheguang/macau/blob/master/data_generator.py))
to generate a larger dataset file with 300 rows, as was done in the original
experiment. The synthetic dataset is located in `sleep_generated.csv`.

We also tweaked the insight specification language proposed by Zgraggen et al.
to represent executable JavaScript logic. Specifically, Zgraggen et al. express
filter as between predicates (similar to SQL) where the lefthand side was not
written to be executable.  For example, we had to change "75 < age >= 55",
which does not make sense in terms of code execution, into "75 > age && age >=
55".  Notice how the lefthand comparator is flipped and we split the
filter into two predicates joined with a logical and operator "&&".
