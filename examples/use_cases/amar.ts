import { op } from 'arquero';
import * as moviesRaw from '../../datasets/movies.json';
import * as oscarsRaw from '../../datasets/oscars.json';
import { Attribute, ValueType, BaseDataset, jsonObjectToDataset } from '../../src/dataset';
import { ArqueroDataTransformation, executeDataTransformation } from '../../src/transformation/arquero';
import { LinearRegressionRelationshipModel } from '../../src/relationship/LinearRegressionRelationshipModel';
import { Evidence } from '../../src/evidence';

const movies: BaseDataset = jsonObjectToDataset(moviesRaw,"beers");
const oscars: BaseDataset = jsonObjectToDataset(oscarsRaw,"breweries");

console.log("filter the oscars dataset for award winners between 2001 and 2011");
const filterTransformation: ArqueroDataTransformation = {
  sources: [oscars], // sources lists all Dataset objects involved in the transformation
  ops: ["filter","filter","derive"],
  transforms: [
    {
      op: "filter",
      args: [(d: Record<string,ValueType>) => d.year <= 2011 && d.year >= 2001]
    },
    {
      op: "filter",
      args: [(d: Record<string,ValueType>) => d.winner]
    },
    {
      op: "derive",
      args: [{"lname": (d: Record<string,ValueType>) => op.lower(d.entity)}]
    }
  ]
};
const ev1: Evidence = {
  name: "filter oscars for winners between 2001 and 2011",
  description: "Amar et al. 2005 evidence example 1",
  timestamp: Date.now(),
  sourceEvidence: [],
  targetEvidence: [],
  transformation: filterTransformation,
  relationshipModel: null,
  results: () => executeDataTransformation(filterTransformation)
};
const winners: BaseDataset = ev1.results();
winners.sources = [oscars];
console.log(winners.records[0]);

console.log("join the movies and winners tables by movie name");
const joinTransformation = {
  sources: [movies,winners],
  ops: ["filter","derive","join","groupby","rollup"], // list all verbs for our records
  transforms: [
    {
      op: "filter",
      args: [(d: Record<string,ValueType>) => d["Running Time min"] !== null]
    },
    {
      op: "derive",
      args: [{"lname": (d: Record<string,ValueType>) => op.lower(d.Title)}]
    },
    {
      op: "join",
      args: [['lname', 'lname']],
      toJoin: winners
    },
    {
      op: "groupby",
      args: ["lname","year"]
    },
    {
      op: "rollup",
      args: [{
        imdb_rating: (d: Record<string, number>) => op.max(d["IMDB Rating"]),
        imdb_votes: (d: Record<string, number>) => op.max(d["IMDB Votes"]),
        movie_length: (d: Record<string, number>) => op.max(d["Running Time min"]),
        total_wins: op.count()
      }]
    }
  ]
};
const ev2: Evidence = {
  name: "join movies and winners",
  description: "Amar et al. 2005 evidence example 2",
  timestamp: Date.now(),
  sourceEvidence: [ev1],
  targetEvidence: [],
  transformation: joinTransformation,
  relationshipModel: null,
  results: () => executeDataTransformation(joinTransformation)
};
ev1.targetEvidence.push(ev2);
const winnersInfo: BaseDataset = ev2.results();
winnersInfo.sources = [movies,winners];
console.log(winnersInfo.records[0]);
console.log(winnersInfo.records.length);

console.log("create data relationship between movie length and oscar wins");
const lrm: LinearRegressionRelationshipModel = new LinearRegressionRelationshipModel(
  "movie length predicts total oscar wins",
  winnersInfo.records[0].attributes.filter((a: Attribute) => a.name === "movie_length"),
  winnersInfo.records[0].attributes.filter((a: Attribute) => a.name === "total_wins")[0]
);
lrm.train(winnersInfo.records);

const ev3: Evidence = {
  name: "movie length predicts total oscar wins",
  description: "Amar et al. 2005 evidence example 3",
  timestamp: Date.now(),
  sourceEvidence: [ev2],
  targetEvidence: [],
  transformation: null,
  relationshipModel: lrm,
  results: () => winnersInfo
};
ev2.targetEvidence.push(ev3);
