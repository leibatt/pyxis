import { Transforms } from 'vega';
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
    //p.replaceAll(a.name, "datum."+a.name),predicate);
    p.replace(new RegExp(a.name, "g"), "datum."+a.name),predicate);
}

/************* END HELPER FUNCTIONS *************/

/************* BEGIN INSIGHT MAPPING FUNCTIONS *************/

export function rankHistogramBins(dataset: pyxis.BaseDataset, zInsight: Record<string,string>, kname?: string,
    binningOptions?: Record<string,string | string[] | number | number[] | boolean>): pyxis.AnalyticKnowledgeNode {

  const dimension: pyxis.Attribute = matchAttributes([zInsight.dimension],dataset.records[0].attributes)[0];
  const bucketFilters: string = zInsight.target_buckets.split(",").map(bf => "(" + bf + ")").join(" || ");

  const transforms: Transforms[] = [];

  // get the extent
  transforms.push({"type": "extent", "field": dimension.name, "signal": dimension.name+"_extent"});

  // apply initial filters, if needed
  if(zInsight.filter && zInsight.filter.length > 0) {
    transforms.push({
      "type": "filter",
      "expr": updatePredicate(dataset.records[0].attributes, zInsight.filter)
    });
  }

  // bin the data
  const binTransform: Transforms = {
    "type": "bin",
    "field": dimension.name,
    "extent": { "signal": dimension.name +"_extent" }
  };
  if(binningOptions) {
    Object.keys(binningOptions).forEach((k: string) => { binTransform[k] = binningOptions[k]} );
  }
  transforms.push(binTransform);

  // filter the data to only the relevant bins
  transforms.push({ "type": "filter", "expr": updatePredicate(dataset.records[0].attributes, bucketFilters) });

  // group by bins and count
  transforms.push({
    "type": "aggregate",
    "groupby": ["bin0", "bin1"], // start and end ranges for the bins
    "fields": [dimension.name],
    "ops": ["count"],
    "as": [dimension.name+"_count"]
  });

  // sort by count in descending order
  transforms.push({
    "type": "collect",
    "sort": {"field": dimension.name+"_count", "order": "descending"}
  });

  // data transformation
  const tdist: pyxis.transformation.VegaDataTransformation = {
    sources: [dataset],
    ops: transforms.map(t => t.type),
    transforms: transforms
  };

  const kdist: pyxis.AnalyticKnowledgeNode = new pyxis.AnalyticKnowledgeNode(
    kname, // name
    Date.now(), // timestamp
    tdist, // transformation
    null, // relationshipModel
    () => pyxis.transformation.vega.executeDataTransformation(tdist), // results
    zInsight.comparison // optional notes
  );

  return kdist;
}


export function linearCorrelation(dataset: pyxis.BaseDataset,
  zInsight: Record<string,string>, kname?: string): pyxis.AnalyticKnowledgeNode {
  const dimAttributes = matchAttributes(zInsight.dimension.split(","),dataset.records[0].attributes);
  const inputs = dimAttributes.slice(0,Math.max(1,dimAttributes.length - 1));
  const output = dimAttributes[dimAttributes.length - 1];

  const lrrm: pyxis.LinearRegressionRelationshipModel =
    new pyxis.LinearRegressionRelationshipModel(
    dataset.name +"_lrrm", inputs, output 
  );

  lrrm.train(dataset.records);
  const krel: pyxis.AnalyticKnowledgeNode = new pyxis.AnalyticKnowledgeNode(
    kname, // name
    Date.now(), // timestamp
    null, // transformation
    lrrm, // relationshipModel
    () => null, // results
    zInsight.comparison // optional notes
  );

  return krel;
}


// Filter the data to identify the alternative and null hypothesis groups.
// Then, calculate the specified aggregate measures for each group.
export function compareGroups(dataset: pyxis.BaseDataset,
  zInsight: Record<string,string>, kname: string): pyxis.AnalyticKnowledgeNode {

  const inputs = getInputs([zInsight.dist_alt,zInsight.dist_null],
    dataset.records[0].attributes);
  const outputs = matchAttributes([zInsight.dimension],
    dataset.records[0].attributes);
  //console.log(["inputs",inputs,"outputs",outputs]);
  const op = getAggregateOperation(zInsight.comparison);
  const dalt = updatePredicate(inputs, zInsight.dist_alt);
  const dnull = updatePredicate(inputs, zInsight.dist_null);
  //console.log(["op",op,"dalt",dalt,"dnull",dnull]);

  // calculate the aggregate statistics for the target records for the alternative hypothesis
  const tdalt: pyxis.transformation.VegaDataTransformation = {
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
    kname+"_alt", // name
    Date.now(), // timestamp
    tdalt, // transformation
    null, // relationshipModel
    () => pyxis.transformation.vega.executeDataTransformation(tdalt), // results
    zInsight.comparison // optional notes
  );

  // calculate the aggregate statistics for the target records for the null hypothesis
  const tdnull: pyxis.transformation.VegaDataTransformation = {
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
  if(dnull.length === 0) { // no filter
    tdnull.transforms.shift(); // get rid of the filter
  }

  const knull: pyxis.AnalyticKnowledgeNode = new pyxis.AnalyticKnowledgeNode(
    kname+"_null", // name
    Date.now(), // timestamp
    tdnull, // transformation
    null, // relationshipModel
    () => pyxis.transformation.vega.executeDataTransformation(tdnull), // results
    zInsight.comparison // optional notes
  );
  knull.addRelated(kalt); // link the analytic knowledge

  return knull;
}

/************* END INSIGHT MAPPING FUNCTIONS *************/

// TODO: Train a data relationship to predict hours_of_sleep using the new attribute as input

// TODO: show how insight could be tested. Maybe use calculation from the paper?

