import { op, desc } from 'arquero';
import { loadDataset, AttributeType, BaseDataset } from '../../src/dataset';
import { ArqueroDataTransformation, executeDataTransformation } from '../../src/transformation/arquero';
import { Concept, DomainKnowledgeNode, Instance, KnowledgeType } from '../../src/knowledge';
import { Evidence } from '../../src/evidence';
import { Insight } from '../../src/insight';

// In this example, we will be recreating the Baltimore crime data investigation
// scenario proposed by Mathisen et al.:
// Mathisen, A., Horak, T., Klokmose, C.N., Grønbæk, K. and Elmqvist, N., 2019,
// June. InsideInsights: Integrating Data‐Driven Reporting in Collaborative
// Visual Analytics. In Computer Graphics Forum (Vol. 38, No. 3, pp. 649-661).

// We are interested in learning more about potential causes for observed
// crimes in Baltimore. let's start with establishing a relevant concept.
const crimeKnowledge: KnowledgeType = "crime";

const crime: Concept = {
  name: "Crime",
  ctype: crimeKnowledge,
  parentTypes: []
};

// We will use the (old) Baltimore Crime dataset in this example (see
// README for source details).  Now load into our BaseDataset object,
// specifying that CrimeDate is temporal
const baltimoreCrime: BaseDataset = loadDataset("BPD_Part_1_Victim_Based_Crime_Data2.json",
  "Baltimore Crime 2012 - 2017", { "CrimeDate": AttributeType.temporal });
console.log("total records:",baltimoreCrime.records.length);
console.log("first record:");
console.log(baltimoreCrime.records[0]);


///////////////////////////////////////////////////////////////////////////////////////
// Now we want to group crime by date and calculate total crimes
console.log("\n\ncalculate total crimes per day and identify top two peak crime days.");
const aggregateTransformation: ArqueroDataTransformation = {
  sources: [baltimoreCrime],
  ops: ["groupby","rollup","orderby","filter"], // list all verbs for our records
  transforms: [
    {
      op: "groupby",
      args: ["CrimeDate"]
    },
    {
      op: "rollup",
      args: [{
        count: op.count()
      }]
    },
    {
      op: "orderby",
      args: [desc("count")]
    },
    {
      op: "filter",
      args: [() => op.rank() <= 2]
    }
  ]
};
// We store the results as our first evidence node
const ev1: Evidence = {
  name: "mathisen2019-1",
  description: "Top three crime peaks: April 27, 2015 (419 crimes), December 20, 2013 (192 crimes), and June 22, 2013 (192 crimes). Mathisen 2019 evidence example 1",
  timestamp: Date.now(),
  sourceEvidence: [],
  targetEvidence: [],
  transformation: aggregateTransformation,
  relationshipModel: null,
  results: () => executeDataTransformation(aggregateTransformation)
};
const peakCrimes: BaseDataset = ev1.results();
peakCrimes.sources = [baltimoreCrime];
console.log(peakCrimes.records[0].attributes);
console.log(peakCrimes.records);

// Looking online, we see that April 27 coincides with an important date of
// protests in Baltimore related to Freddie Gray's funeral. We want to link this
// knowledge with our evidence. We start by establishing related concepts:
const protest: Concept = {
  name: "Protest",
  ctype: crimeKnowledge,
  parentTypes: []
};
const baltimoreProtests: Instance = {
  name: "WikipediaArticle-2015BaltimoreProtests",
  id: "in-2015-baltimore-protests",
  coreConcept: protest,
  data: {
    attributes: [{ name: "link", attributeType: AttributeType.nominal }],
    values: {"link": "https://en.wikipedia.org/wiki/2015_Baltimore_protests"},
    id: "dr-2015-baltimore-protests"
  }
};
const protestsNode: DomainKnowledgeNode = new DomainKnowledgeNode(crimeKnowledge,baltimoreProtests);
// Now we can link our protests knowledge node with our evidence:
const protestsInsight: Insight = {
  name: "mathisen2019insight1",
  description: "The day with the highest crime was April 27, 2015, the same day as the funeral of Freddy Gray, which led to widespread protests in Baltimore.",
  domainKnowledge: [protestsNode],
  analyticKnowledge: [ev1],
  sourceInsights: [],
  targetInsights: []
};


///////////////////////////////////////////////////////////////////////////////////////
// filter for crimes on April 27, 2015
console.log("\n\nCalculate distribution of crimes on the first peak day: April 27, 2015.");
const aggregateTransformation2: ArqueroDataTransformation = {
  sources: [baltimoreCrime],
  ops: ["filter","groupby","rollup"], // list all verbs for our records
  transforms: [
    {
      op: "filter",
      // NOTE: op.month returns a zero-based value, not a one-based value
      args: [(d: Record<string, number>) => op.year(d["CrimeDate"]) === 2015 &&
        op.month(d["CrimeDate"]) === 3 && op.date(d["CrimeDate"]) === 27]
    },
    {
      op: "groupby",
      args: ["Description"]
    },
    {
      op: "rollup",
      args: [{
        count: op.count()
      }]
    },
    {
      op: "orderby",
      args: [desc("count")]
    }
  ]
};
// We store the results as our second evidence node
const ev2: Evidence = {
  name: "mathisen2019-2",
  description: "Distribution of crimes observed for the April 27, 2015 peak. Burglaries are the most frequent crime type on this day (210 crimes). Mathisen 2019 evidence example 2",
  timestamp: Date.now(),
  sourceEvidence: [ev1],
  targetEvidence: [],
  transformation: aggregateTransformation2,
  relationshipModel: null,
  results: () => executeDataTransformation(aggregateTransformation2)
};
const apr27Crimes: BaseDataset = ev2.results();
apr27Crimes.sources = [baltimoreCrime];
console.log(apr27Crimes.records[0].attributes);
console.log(apr27Crimes.records);

// Calculate distribution of crimes over time
console.log("\n\nCalculate distribution of crimes over time.");
const aggregateTransformation3: ArqueroDataTransformation = {
  sources: [baltimoreCrime],
  ops: ["groupby","rollup"], // list all verbs for our records
  transforms: [
    {
      op: "groupby",
      args: ["CrimeDate","Description"]
    },
    {
      op: "rollup",
      args: [{
        count: op.count()
      }]
    },
    {
      op: "orderby",
      args: ["CrimeDate",desc("count")]
    }
  ]
};
// We store the results as our third evidence node
const ev3: Evidence = {
  name: "mathisen2019-3",
  description: "Distribution of crimes over time. Verifying that no one crime type dominates the observed peak crime days. Mathisen 2019 evidence example 3",
  timestamp: Date.now(),
  sourceEvidence: [ev2],
  targetEvidence: [],
  transformation: aggregateTransformation3,
  relationshipModel: null,
  results: () => executeDataTransformation(aggregateTransformation3)
};
const crimeDist: BaseDataset = ev3.results();
crimeDist.sources = [baltimoreCrime];
console.log("first record:");
console.log(crimeDist.records[0]);

// Since we find that Burglary was the most common crime, and unusually so, we
// want to incorporate this information in our knowledge base.
const burglary: Instance = {
  name: "WikipediaArticle-Burglary",
  id: "in-burglary",
  coreConcept: crime,
  data: {
    attributes: [{ name: "link", attributeType: AttributeType.nominal }],
    values: {"link": "https://en.wikipedia.org/wiki/Burglary"},
    id: "dr-burglary"
  }
};
const burglaryNode: DomainKnowledgeNode = new DomainKnowledgeNode(crimeKnowledge,burglary);
burglaryNode.addCausedBy(protestsNode);
const burglaryInsight: Insight = {
  name: "mathisen2019insight2",
  description: "Burglaries were the most common type of crime observed on April 27, 2015. Burglaries were unusually high this day. This is likely due to the protests.",
  domainKnowledge: [burglaryNode],
  analyticKnowledge: [ev2, ev3],
  sourceInsights: [protestsInsight],
  targetInsights: []
};
protestsInsight.targetInsights.push(burglaryInsight); // link this insight with our previous one


///////////////////////////////////////////////////////////////////////////////////////
// Calculate distribution of burglaries on April 27, 2015 across districts
console.log("\n\nCalculate distribution of burglaries across districts for April 27, 2015.");
const aggregateTransformation4: ArqueroDataTransformation = {
  sources: [baltimoreCrime],
  ops: ["filter","filter","groupby","rollup"], // list all verbs for our records
  transforms: [
    {
      op: "filter",
      args: [(d: Record<string, Date>) => op.year(d["CrimeDate"]) === 2015 &&
        op.month(d["CrimeDate"]) === 3 && op.date(d["CrimeDate"]) === 27]
    },
    {
      op: "filter",
      args: [(d: Record<string, string>) => d["Description"] === "BURGLARY"]
    },
    {
      op: "groupby",
      args: ["District"]
    },
    {
      op: "rollup",
      args: [{
        count: op.count()
      }]
    },
    {
      op: "orderby",
      args: [desc("count")]
    }
  ]
};
// We store the results as our fourth evidence node
const ev4: Evidence = {
  name: "mathisen2019-4",
  description: "Distribution of crimes by district. The burglaries seem to be fairly evenly distributed throughout the city, with slightly more burglaries observed in Western Baltimore. Mathisen 2019 evidence example 4",
  timestamp: Date.now(),
  sourceEvidence: [ev2],
  targetEvidence: [],
  transformation: aggregateTransformation4,
  relationshipModel: null,
  results: () => executeDataTransformation(aggregateTransformation4)
};
const crimeLoc: BaseDataset = ev4.results();
crimeLoc.sources = [baltimoreCrime];
console.log(crimeLoc.records[0].attributes);
console.log(crimeLoc.records);
// This evidence seems relevant to both prior insights, so we will add it to
// both:
protestsInsight.analyticKnowledge.push(ev4);
burglaryInsight.analyticKnowledge.push(ev4);

// Finally, we will create a final insight to capture the summary takeaway from
// Figure 8 of the original paper:
const summaryInsight: Insight = {
  name: "mathisen2019insight3",
  description: "Quoting the paper: 'The main result shows that burglars occasionally take advantage of chaotic situations elsewhere in the city, likely because they know this will draw much attention of the police'",
  domainKnowledge: [],
  analyticKnowledge: [],
  sourceInsights: [protestsInsight, burglaryInsight],
  targetInsights: []
};
protestsInsight.targetInsights.push(summaryInsight); // link up with the new insight
burglaryInsight.targetInsights.push(summaryInsight);
