import { desc, op } from 'arquero';
import { loadDataset, AttributeType, BaseDataset } from '../../../src/dataset';
import { ArqueroDataTransformation, executeDataTransformation } from '../../../src/transformation/arquero';
import { Evidence } from '../../../src/evidence';

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
// Participants answered the following question for this task:
// Consider these four parts of the aircraft: engine 1 ([Dam Eng1]), engine 2
// ([Dam Eng2]), the windshield ([Dam Windshield]), and wing/rotor ([Dam Wing
// Rot]). Which parts of the aircraft appear to get damaged the most?

// The most common answer was: "Wing/rotor damaged the most". Here, we
// calculate the results that led many participants to this finding.
console.log("\n\ncalculate total incidents of all damage per component.");
const aggregateTransformation: ArqueroDataTransformation = {
  sources: [birdstrikes],
  ops: ["rollup"], // list all verbs for our records
  transforms: [
    {
      op: "rollup",
      args: [{ // count the times each part type was damaged
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
// In printing the results, we see the largest count for "count_wing_rot",
// consistent with participants' answers
console.log(ev1.results().records[0]);

/************ BIRDSTRIKES TASK 2: "Airplane has more occurrences of damage" ************/
// Participants answered the following question for this task:
// Which aircraft classes ([Ac Class]), if any, appear to be more susceptible
// to damage ([Damage]) from animal strikes? Note that [Damage] also records
// when no damage has occurred.

// The most common answer was: "Airplane has more occurrences of damage". Here, we
// calculate the results that led many participants to this finding.
const groupedAggregateTransformation: ArqueroDataTransformation = {
  sources: [birdstrikes],
  ops: ["filter","groupby","rollup","orderby"], // list all verbs for our records
  transforms: [
    {
      op: "filter",
      args: [(d: Record<string, string>) => d["damage"] !== null && d["damage"] !== "N" && d["ac_class"] !== null]
    },
    {
      op: "groupby",
      args: ["ac_class"]
    },
    {
      op: "rollup",
      args: [{ // count the times each part type was damaged
        count: op.count()
      }]
    },
    {
      op: "orderby",
      args: [desc("count")]
    }
  ]
};
const ev2: Evidence = {
  name: "battle2019-2",
  description: "Airplane has more occurrences of damage",
  timestamp: Date.now(),
  sourceEvidence: [],
  targetEvidence: [],
  transformation: groupedAggregateTransformation,
  relationshipModel: null,
  results: () => executeDataTransformation(groupedAggregateTransformation)
};
// In printing the results, we see the largest count for ac_class='A' (i.e., airplanes),
// consistent with participants' answers
const aircraftDamageData: BaseDataset = ev2.results();
for(let i = 0; i < aircraftDamageData.records.length; i++) {
  console.log(aircraftDamageData.records[i]);
}

/************ BIRDSTRIKES TASK 3: "Incidents occur more in bad weather (ignore clear weather)" ************/
// Participants answered the following question for this task:
// What relationships (if any) do you observe involving weather conditions
// ([Precip], [Sky]) and strike frequency, or counts over time ([Incident
// Date])?

