import { desc, op } from 'arquero';
import { loadDataset, AttributeType, BaseDataset } from '../../../src/dataset';
import { ArqueroDataTransformation, executeDataTransformation } from '../../../src/transformation/arquero';
import { Concept, DomainKnowledgeNode, Instance, KnowledgeType } from '../../../src/knowledge';
import { Evidence } from '../../../src/evidence';
import { Insight } from '../../../src/insight';

// In this example, we will be recreating participants' answers to tasks
// involving the birdstrikes dataset, studied by Battle & Heer:
// Battle, L. and Heer, J., 2019, June. Characterizing exploratory visual
// analysis: A literature review and evaluation of analytic provenance in
// tableau. In Computer graphics forum (Vol. 38, No. 3, pp. 145-159).

// Please see the README in this folder for more details.

// loading the dataset
const birdstrikes: BaseDataset = loadDataset(
  "birdstrikes.json",
  "Birdstrikes",
  {
    "incident_date": AttributeType.temporal,
    "reported_date": AttributeType.temporal
  }
);
console.log(birdstrikes.records[0]);


/************ BIRDSTRIKES TASK 1: "Wing/rotor damaged the most" ************/
// Consider these four parts of the aircraft: engine 1 ([Dam Eng1]), engine 2
// ([Dam Eng2]), the windshield ([Dam Windshield]), and wing/rotor ([Dam Wing
// Rot]). Which parts of the aircraft appear to get damaged the most?

console.log("\n\ncalculate total incidents of all damage per component.");
const aggregateTransformation: ArqueroDataTransformation = {
  sources: [birdstrikes],
  ops: ["filter","rollup"], // list all verbs for our records
  transforms: [
    {
      op: "rollup",
      args: [{
        count_eng1: op.sum("dam_eng1"),
        count_eng2: op.sum("dam_eng2"),
        count_windshield: op.sum("dam_windshld"),
        count_wing_rot: op.sum("dam_wing_rot")
      }]
    }
/*
    {
      op: "groupby",
      args: ["ac_class"]
    },
    {
      op: "rollup",
      args: [{ c: op.count() }]
    },
    {
      op: "derive",
      args: [
        {
          s: op.sum("c"),
          p: (d: Record<string, number>) => d.c / op.sum(d.c),
        }
      ]
    }
*/
  ]
};
const ev1: Evidence = {
  name: "battle2019-1",
  description: "The wing/rotor get damaged the most",
  timestamp: Date.now(),
  sourceEvidence: [],
  targetEvidence: [],
  transformation: aggregateTransformation,
  relationshipModel: null,
  results: () => executeDataTransformation(aggregateTransformation)
};
console.log(ev1.results().records[0]);

/************ BIRDSTRIKES TASK 2: "Airplane has more occurrences of severe damage" ************/
// Which aircraft classes ([Ac Class]), if any, appear to be more susceptible
// to damage ([Damage]) from animal strikes? Note that [Damage] also records
// when no damage has occurred.


/************ BIRDSTRIKES TASK 3: "Incidents occur more in bad weather (ignore clear weather)" ************/
// What relationships (if any) do you observe involving weather conditions
// ([Precip], [Sky]) and strike frequency, or counts over time ([Incident
// Date])?

