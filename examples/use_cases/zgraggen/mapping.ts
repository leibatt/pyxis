import { v4 as uuid } from 'uuid';
import * as pyxis from '../../../src/index';

/************* BEGIN HELPER FUNCTIONS *************/

// find the attributes that match the given list of names
export function matchAttributes(names: string[], attributes: pyxis.Attribute[]): pyxis.Attribute[] {
  return attributes.filter(a => names.indexOf(a.name) >= 0);
}

// extract relevant attributes from a list of predicates
export function getInputs(predicates: string[], attributes: pyxis.Attribute[]): pyxis.Attribute[] {
  return attributes.filter(a => predicates.some(p => p.indexOf(a.name) >= 0));
}

// extract the target aggregate operation(s). Handles most examples expressed
// in the Zgraggen et al. paper
export function getAggregateOperation(comparison: string): string | null {
  if(comparison.indexOf("_smaller") >= 0) {
    return comparison.split("_smaller")[0];
  } else if (comparison === "rank_buckets_count") { // test correlation
    return "count";
  } else if (comparison === "not_corr") { // test correlation
    return null;
  }
  return null;
}

// update attribute names to match Vega transform syntax
function updatePredicate(attributes: pyxis.Attribute[], predicate: string) {
  return attributes.reduce((p: string, a: pyxis.Attribute) =>
    p.replaceAll(a.name, "datum."+a.name),predicate);
}

/************* END HELPER FUNCTIONS *************/

/************* BEGIN INSIGHT MAPPING FUNCTIONS *************/

// Filter the data to identify the alternative and null hypothesis groups.
// Then, calculate the specified aggregate measures for each group.
export function compareGroups(dataset: pyxis.BaseDataset,
  zInsight: Record<string,string>, suffix?: string): pyxis.AnalyticKnowledgeNode {

  if(suffix === undefined) {
    suffix = uuid();
  }

  const inputs = getInputs([zInsight.dist_alt,zInsight.dist_null],
    dataset.records[0].attributes);
  const outputs = matchAttributes([zInsight.dimension],
    dataset.records[0].attributes);
  console.log([inputs,outputs]);
  const op = getAggregateOperation(zInsight.comparison);
  const dalt = updatePredicate(inputs, zInsight.dist_alt);
  const dnull = updatePredicate(inputs, zInsight.dist_null);
  console.log([op,dalt,dnull]);

  // calculate the aggregate statistics for the target records for the alternative hypothesis
  let tdalt: pyxis.transformation.VegaDataTransformation = {
    sources: [dataset],
    ops: ["filter", "aggregate"],
    transforms: [
      {
        "type": "filter",
        "expr": dalt
      },
      { // calculate the aggregate stats for this group
        "type": "aggregate",
        "fields": outputs.map(a => a.name),
        "ops": new Array(outputs.length).fill(op)
      }
    ]
  };

  const kalt: pyxis.AnalyticKnowledgeNode = new pyxis.AnalyticKnowledgeNode(
    "Zgraggen2018-alt_" + suffix, // name
    Date.now(), // timestamp
    tdalt, // transformation
    null, // relationshipModel
    () => pyxis.transformation.vega.executeDataTransformation(tdalt) // results
  );

  // calculate the aggregate statistics for the target records for the null hypothesis
  let tdnull: pyxis.transformation.VegaDataTransformation = {
    sources: [dataset],
    ops: ["filter", "aggregate"],
    transforms: [
      {
        "type": "filter",
        "expr": dnull
      },
      { // calculate the aggregate stats for this group
        "type": "aggregate",
        "fields": outputs.map(a => a.name),
        "ops": new Array(outputs.length).fill(op)
      }
    ]
  };

  const knull: pyxis.AnalyticKnowledgeNode = new pyxis.AnalyticKnowledgeNode(
    "Zgraggen2018-null_" + suffix, // name
    Date.now(), // timestamp
    tdnull, // transformation
    null, // relationshipModel
    () => pyxis.transformation.vega.executeDataTransformation(tdnull) // results
  );
  knull.addSource(kalt); // link the analytic knowledge

  return knull;
}

/************* END INSIGHT MAPPING FUNCTIONS *************/

// TODO: Train a data relationship to predict hours_of_sleep using the new attribute as input

// TODO: show how insight could be tested. Maybe use calculation from the paper?

