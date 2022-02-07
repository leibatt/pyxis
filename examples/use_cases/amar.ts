import { op } from 'arquero';
import { loadDataset, Attribute, AttributeType, ValueType, BaseDataset } from '../../src/dataset';
import { ArqueroDataTransformation, executeDataTransformation } from '../../src/transformation/arquero';
import { LinearRegressionRelationshipModel } from '../../src/relationship/LinearRegressionRelationshipModel';
import { Concept, DomainKnowledgeNode, Instance, KnowledgeType } from '../../src/knowledge';
import { Evidence } from '../../src/evidence';
import { Insight } from '../../src/insight';

// In this example, we will be recreating the movies dataset exploration scenario proposed by Amar et al:
// Amar, R., Eagan, J. and Stasko, J., 2005, October. Low-level components of
// analytic activity in information visualization. In IEEE Symposium on
// Information Visualization, 2005. INFOVIS 2005. (pp. 111-117). IEEE.

// Perhaps an interesting article on movie lengths spurred our analysis, e.g.,
// https://www.businessinsider.com/are-movies-getting-longer-2016-6
// We can record our domain knowledge using a knowledge node.
const filmKnowledge: KnowledgeType = "FilmKNowledge";
const articleConcept: Concept = {
  name: "MediaArticle",
  ctype: filmKnowledge,
  parentTypes: []
};
const qualityConcept: Concept = {
  name: "FilmQuality",
  ctype: filmKnowledge,
  parentTypes: []
};

const biArticle: Instance = {
  name: "BusinessInsiderArticle",
  id: "in-bi-mv-ln",
  coreConcept: articleConcept,
  relevantConcepts: [qualityConcept],
  data: {
    attributes: [{ name: "link", attributeType: AttributeType.nominal }],
    values: {"name": "https://www.businessinsider.com/are-movies-getting-longer-2016-6"},
    id: "dr-bi-mv-ln"
  }
};

// We create a knowledge node representing our understanding of how film length
// may affect quality or not.
const knowledgeNode: DomainKnowledgeNode = new DomainKnowledgeNode("filmQualityKnowledge",biArticle);

// To investigate evidence, we will use the movies dataset and oscars dataset
// in this example (see README for source details).
const movies: BaseDataset = loadDataset("movies.json","movies");
const oscars: BaseDataset = loadDataset("oscars.json","oscars");

// Our overall goal is to assess the relationship (if any) between movie length and
// movie popularity for award-winning movies over a ten year period.  First, we
// need to preprocess the data to identify award winning movies.
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
// We record the collection of award-winning movies as our first evidence node.
const ev1: Evidence = {
  name: "amar2005-1",
  description: "Oscar-winning movies between 2001 and 2011. Amar et al. 2005 evidence example 1",
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

// Now, we want additional information about each movie, e.g., movie length, so
// we join our winners dataset with the movies dataset.
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
// We store the joined table as our second evidence node, and link it to the first.
const ev2: Evidence = {
  name: "amar2005-2",
  description: "Oscar-winning movies between 2001 and 2011 with additional details. Amar et al. 2005 evidence example 2",
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

// Now that we have the collection of movies we are interested in and the
// necessary details for assessing our target relationship (movie length and
// popularity), we can construct the relationship.
console.log("create data relationship between movie length and oscar wins");
const lrm: LinearRegressionRelationshipModel = new LinearRegressionRelationshipModel(
  "movie length predicts total oscar wins",
  winnersInfo.records[0].attributes.filter((a: Attribute) => a.name === "movie_length"),
  winnersInfo.records[0].attributes.filter((a: Attribute) => a.name === "total_wins")[0]
);
lrm.train(winnersInfo.records);
// We store the final relationship as our third evidence node.
const ev3: Evidence = {
  name: "amar2005-3",
  description: "movie length predicts total oscar wins. Amar et al. 2005 evidence example 3",
  timestamp: Date.now(),
  sourceEvidence: [ev2],
  targetEvidence: [],
  transformation: null,
  relationshipModel: lrm,
  results: () => winnersInfo
};
ev2.targetEvidence.push(ev3);

// Finally, we can formally connect our domain knowledge (knowledge node) and analytic knowledge (evidence nodes) to form a new insight:
const movieInsight: Insight = {
  name: "amar2005insight",
  description: "connecting what was learned in an article with movies data",
  domainKnowledge: [knowledgeNode],
  analyticKnowledge: [ev1, ev2, ev3],
  sourceInsights: [],
  targetInsights: []
};
console.log(movieInsight);
