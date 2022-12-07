#!/usr/bin/env python
'''
data_generator.py generates data with embedded correlations.
Copyright (C) 2017  Zheguang Zhao <zheguang.zhao@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
'''
import sys
import math
import numpy
import random
import re


class CovarianceMatrix:
    def __init__(self, table=None, attrs=[], entries=[]):
        self.attrs = attrs
        self.entries = entries
        self.table = table

    def cov(self, attr_a, attr_b):
        entry_a = self.attrs.index(attr_a)
        entry_b = self.attrs.index(attr_b)
        return self.entries[entry_a][entry_b]

    def set_cov(self, attr_a, attr_b, covariance):
        entry_a = self.attrs.index(attr_a)
        entry_b = self.attrs.index(attr_b)
        self.entries[entry_a][entry_b] = covariance
        self.entries[entry_b][entry_a] = covariance

    def sample(self, attr_synopses={}, n_samples=1):
        assert self.entries != []
        attr_synopses = list(map(lambda x: attr_synopses[x], self.attrs))

        means = list(map(lambda x: x.mu, attr_synopses))

        # sample from multivariate normal until enough samples fall within the empirical domain
        nonnull_samples = []
        while True:
            samples = numpy.random.multivariate_normal(means, self.entries, n_samples).tolist()

            columns = transpose(samples)
            attr_columns = zip(attr_synopses, columns)

            attr_discretized_columns = map(lambda x: (x[0], x[0].discretize(x[1]) if isinstance(x[0], DiscreteAttrSynopsis) else x[1]), attr_columns)
            attr_domainized_columns = map(lambda x: (x[0], x[0].domainize(x[1])), attr_discretized_columns)

            domainized_rows = transpose(list(map(lambda x: list(x[1]), attr_domainized_columns)))
            nonnull_rows = filter(lambda x: None not in x, domainized_rows)
            nonnull_samples += nonnull_rows
            if len(nonnull_samples) >= n_samples:
                nonnull_samples = nonnull_samples[:n_samples]
                break
            else:
                continue

        assert len(nonnull_samples) == n_samples
        nonnull_columns = transpose(nonnull_samples)
        attr_nonnull_columns = zip(attr_synopses, nonnull_columns)

        attr_categorized_columns = map(lambda x: (x[0], x[0].categorize(x[1]) if type(x[0]) is OrdinalAttrSynopsis else x[1]), attr_nonnull_columns)
        attr_stringified_columns = map(lambda x: (x[0], x[0].stringify(x[1])), attr_categorized_columns)

        formatted_columns = list(map(lambda x: list(x[1]), attr_stringified_columns))
        assert len(formatted_columns) == len(self.attrs), '{},{},{},{}'.format(self.attrs, self.entries, len(columns), len(attr_synopses))

        if len(set(self.attrs)) == 1:
            formatted_columns = [formatted_columns[0]]
        else:
            assert len(set(self.attrs)) == len(self.attrs), 'should be distinct joint normal'

        return formatted_columns

    def debug(self):
        return '{attrs}\n{entries}'.format(attrs=self.attrs, entries=numpy.array(self.entries))

    @staticmethod
    def fromTableAttrs(table, attrs=[], is_correlated=True):
        cov_mat = CovarianceMatrix(table=table, attrs=attrs, entries=numpy.zeros((len(attrs), len(attrs))).tolist())
        pairs = [(x, y) for x in attrs for y in attrs if x <= y] # unique pair of attrs
        for p in pairs:
            if p[0] == p[1]:
                rho = 1
            elif p[0] == 'id:INTEGER' or p[1] == 'id:INTEGER':
                raise RuntimeError('id attribute not supported')
            else:
                if is_correlated:
                    while True:
                        rho = random.choice([-1,1]) * random.random()
                        if rho == 0:
                            continue
                        else:
                            break
                else:
                    rho = 0
            cov_mat.set_cov(p[0], p[1], rho * table.attr_synopses[p[0]].sigma * table.attr_synopses[p[1]].sigma)
        return cov_mat


class AttrSynopsis(object):
    def __init__(self, attr='', domain=(-float("inf"), float("inf")), mu=0.0, sigma=1.0, shift=0):
        self.attr = attr
        self.domain = domain
        self.mu = mu
        self.sigma = sigma
        self.shift = shift

    def domainize(self, xs):
        return map(lambda x: x if self.domain[0] <= x and x <= self.domain[1] else None, xs)

    def stringify(self, xs):
        return map(lambda x: '' if x == None else str(x), xs)

    def debug(self):
        return 'type={type},attr={attr},domain={domain},mu={mu},sigma={sigma}'.format(type=type(self), attr=self.attr, domain=self.domain, mu=self.mu, sigma=self.sigma)

    @staticmethod
    def fromAttrColumn(attr, column, set_category_order, source_attr_synopsis=None):
        column = list(filter(lambda x: x != '', column))

        def dist_params(xs):
            mu = math.fsum(xs) / float(len(xs))
            sigma = math.sqrt(math.fsum(map(lambda x: pow((x - mu), 2), xs)) / float(len(xs)))
            domain = (min(xs), max(xs))
            return (mu, sigma, domain)

        if 'STRING' in attr:
            if source_attr_synopsis == None:
                category_order = list(set(column))
                random.shuffle(category_order)

                if set_category_order != None:
                    category_order = set_category_order
            else:
                category_order = source_attr_synopsis.category_order

            ordinalized_col = list(map(lambda x: category_order.index(x), column))
            (mu, sigma, _) = dist_params(ordinalized_col)
            domain = (0, len(category_order) - 1)
            return OrdinalAttrSynopsis(attr, domain=domain, mu=mu, sigma=sigma, category_order=category_order)
        else:
            num_column = list(map(float, column))
            (mu, sigma, domain) = dist_params(num_column)

            if 'FLOAT' in attr:
                return ContinuousAttrSynopsis(attr, domain=domain, mu=mu, sigma=sigma)
            elif 'INTEGER' in attr:
                return DiscreteAttrSynopsis(attr, domain=domain, mu=mu, sigma=sigma)
            else:
                raise RuntimeError('unsupported type: {}'.format(attr))

    @staticmethod
    def fromAttr(attr, mu, sigma, domain, category_order):
        assert ':' in attr, 'attr must be typed'
        if 'STRING' in attr:
            return OrdinalAttrSynopsis(attr, domain=domain, mu=mu, sigma=sigma, category_order=category_order)
        else:
            if 'FLOAT' in attr:
                return ContinuousAttrSynopsis(attr, domain=domain, mu=mu, sigma=sigma)
            elif 'INTEGER' in attr:
                return DiscreteAttrSynopsis(attr, domain=domain, mu=mu, sigma=sigma)
            else:
                raise RuntimeError('unsupported type: {}'.format(attr))



class DiscreteAttrSynopsis(AttrSynopsis):
    def discretize(self, xs):
        return numpy.array(list(map(lambda x: int(round(x)), xs)))



class ContinuousAttrSynopsis(AttrSynopsis):
    pass


class OrdinalAttrSynopsis(DiscreteAttrSynopsis):
    def __init__(self, attr, domain, mu, sigma, category_order=[]):
        super().__init__(attr, domain, mu, sigma)
        self.category_order = category_order

    def debug(self):
        return '{parent},category_order={category_order}'.format(parent=super().debug(), category_order=self.category_order)

    def categorize(self, xs):
        return map(lambda x: None if x == None else self.category_order[x], xs)


class Table(object):
    def __init__(self, attrs=[], records=[], attr_synopses={}):
        self.attrs = attrs
        self.records = records
        self.attr_synopses = attr_synopses

    def debug(self):
        attrs = 'attrs:\n{attrs}'.format(attrs=str(self.attrs))
        attr_synopses = 'attr_synopses:\n{attr_synopses}'.format(attr_synopses='\n'.join(map(lambda x: x.debug(), self.attr_synopses.values())))
        return '{attrs}\n{attr_synopses}'.format(attrs=attrs, attr_synopses=attr_synopses)

    @staticmethod
    def fromFile(fpath, existing_note_file):
        with open(fpath, 'r') as f:
            data = list(map(lambda x: x.strip().split(','), f))
            attrs = data[0]
            records = data[1:]
            columns = transpose(records)
            assert len(columns) == len(attrs)

            attr_synopses = {}
            for x in zip(attrs, columns):
                set_category_order = None
                if existing_note_file != None and 'STRING:TreatAsEnumeration' in x[0]:
                    note = None
                    with open(existing_note_file, 'r') as content_file:
                        note = content_file.read()
                    #print(re.search(r'' + x[0] + '.*category_order=[(.*)]', note).groups()[0])
                    print(x[0])
                    o = re.search(r'.*(' + x[0] + ',domain.*category_order=\[(.*)\])', note).groups()[1]
                    o = o.split(',')
                    o = [s.strip().replace('\'', '') for s in o]
                    set_category_order = o

                attr_synopses[x[0]] =  AttrSynopsis.fromAttrColumn(x[0], x[1], set_category_order)
            return Table(attrs=attrs, records=records, attr_synopses=attr_synopses)

    def writeToFile(self, fpath):
        with open(fpath, 'w') as f:
            f.write('{}\n'.format(','.join(self.attrs)))
            for record in self.records:
                f.write('{}\n'.format(','.join(map(str, record))))


class SampleTable(Table):
    def __init__(self, attrs=[], records=[], attr_synopses={}, seed=1, n_variate=2, cov_mats=[], source_table=None):
        super().__init__(attrs=attrs, records=records, attr_synopses=attr_synopses)
        self.seed = seed
        self.n_variate = n_variate
        self.cov_mats = cov_mats
        self.source_table = source_table

    def debug(self):
        return '{parent}\nseed={seed}\nn_variate={n_variate}\ncov_mats:\n{cov_mats}\nsource_table:\n{source_table}'.format(parent=(super().debug()), seed=self.seed, n_variate=self.n_variate, cov_mats='\n'.join(map(lambda x: x.debug(), self.cov_mats)), source_table='None' if self.source_table is None else self.source_table.debug())

    @staticmethod
    def fromTable(table, seed=1, n_samples=100, correlated_bivariate_ratio=0.0):
        attrs_perm = [x for x in table.attrs if x != 'id:INTEGER']
        random.shuffle(attrs_perm)
        assert 'id:INTEGER' not in attrs_perm

        n_variate = 2
        variates = list(map(lambda i: [attrs_perm[n_variate * i], attrs_perm[min(n_variate * i + 1, len(attrs_perm) - 1)]], range(math.ceil(len(attrs_perm) / n_variate))))

        n_correlated = math.floor(len(variates) * correlated_bivariate_ratio)
        is_correlateds = [1] * n_correlated + [0] * (len(variates) - n_correlated)
        assert len(is_correlateds) == len(variates)
        cov_mats = list(map(lambda x: CovarianceMatrix.fromTableAttrs(table, attrs=x[0], is_correlated=x[1]), zip(variates, is_correlateds)))

        mv_columns_perm = list(map(lambda x: x.sample(table.attr_synopses, n_samples), cov_mats))
        columns_perm = []
        for c in mv_columns_perm:
            columns_perm += c

        attr_columns_perm = dict(zip(attrs_perm, columns_perm))
        columns = list(map(lambda x: attr_columns_perm[x] if x != 'id:INTEGER' else list(range(n_samples)), table.attrs))
        attr_synopses = dict(map(lambda x: (x[0], AttrSynopsis.fromAttrColumn(x[0], x[1], None, table.attr_synopses[x[0]])), zip(table.attrs, columns)))
        rows = transpose(columns)

        return SampleTable(attrs=table.attrs, records=rows, attr_synopses=attr_synopses, seed=seed, n_variate=n_variate, cov_mats=cov_mats, source_table=table)

    @staticmethod
    def fromGroundTruth(truth, seed=1, n_samples=100):
        assert 'id:INTEGER' not in truth.typed_attrs

        n_variate = 2
        cov_mats = truth.cov_mats

        mv_columns_perm = list(map(lambda x: x.sample(truth.attr_synopses, n_samples), cov_mats))

        attr_columns_perm = {}
        for (cov_mat, mv_cols) in zip(cov_mats, mv_columns_perm):
            attr_columns_perm[cov_mat.attrs[0]] = mv_cols[0]
            attr_columns_perm[cov_mat.attrs[1]] = mv_cols[1]

        columns = list(map(lambda x: attr_columns_perm[x], truth.typed_attrs))
        attr_synopses = dict(map(lambda x: (x[0], AttrSynopsis.fromAttrColumn(x[0], x[1], None, truth.attr_synopses[x[0]])), zip(truth.typed_attrs, columns)))
        rows = transpose(columns)

        return SampleTable(attrs=truth.typed_attrs, records=rows, attr_synopses=attr_synopses, seed=seed, n_variate=n_variate, cov_mats=cov_mats, source_table=truth)


    def writeToFile(self, fpath):
        super().writeToFile(fpath)

        with open('{}.note'.format(fpath), 'w') as f:
            f.write(self.debug())


def transpose(rows):
    return [list(map(lambda x: x[i], rows)) for i in range(0, len(rows[0]))]


def main(argv):
    if argv[1] == '-h':
        print('usage: data_generator.py input.csv output.csv seed n_samples correlated_bivariate_ratio')
    else:
        fpath = argv[1]
        opath = argv[2]
        seed = int(argv[3])
        n_samples = int(argv[4])
        correlated_bivariate_ratio = float(argv[5])

        existing_note_file = None
        if len(argv) == 7:
            existing_note_file = argv[6]

        random.seed(seed)
        numpy.random.seed(seed)

        table = Table.fromFile(fpath, existing_note_file)
        #print(table.debug())
        #numpy.set_printoptions(precision=3, suppress=True)

        sample_table = SampleTable.fromTable(table, seed=seed, n_samples=n_samples, correlated_bivariate_ratio=correlated_bivariate_ratio)
        #print(sample_table.debug())
        sample_table.writeToFile(opath)


if __name__ == '__main__':
    main(sys.argv)

