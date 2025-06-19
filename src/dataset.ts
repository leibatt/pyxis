import * as uuid from 'uuid';
import { smartStringify } from './util';
import { RegistryWildcard } from './wildcard';
import { Registry } from './registry';

export enum AttributeType {
  nominal = "nominal",
  ordinal = "ordinal",
  quantitative = "quantitative",
  temporal = "temporal"
}

// sets attribute type by default, may not get things right for ordinal or
// temporal
export const AttributeTypeMapping: Record<string, AttributeType | null> = {
  string: AttributeType.nominal,
  number: AttributeType.quantitative,
  bigint: AttributeType.quantitative,
  boolean: AttributeType.nominal,
  symbol: null,
  undefined: null,
  object: null,
  function: null
}

export function getAttributeType(t: string): AttributeType {
  return AttributeTypeMapping[t];
}

export interface Attribute {
  name: string; // name of the attribute
  attributeType: AttributeType; // what type of attribute?
  dependences?: Attribute[]; // does the value of this attribute depend on other attributes?
  computed?: boolean; // did code generate this attribute?
}

// types of data values within an attribute
export type ValueType = string | boolean | number | bigint | Date;

export interface DataRecord {
  attributes: Attribute[]; // the attributes stored in this record
  values: Record<string, ValueType | null>; // the values stored in this record, one per attribute, can be null
  id: string; // unique identifier for this record
  hash?: () => string;
  getValueByName?: (name: string) => ValueType
  getValueByIndex?: (index: number) => ValueType
}

export function jsonToDataRecord(record: Record<string, ValueType | null>, id: string = null, typeHints: Record<string, AttributeType> = {}): BaseDataRecord {
  const attributes: Attribute[] = (Object.keys(record)).map((k) => {
    if(k in typeHints) {
      if(typeHints[k] === AttributeType.temporal) {
        record[k] = new Date(record[k] as string); // convert to Date object
      }
      return {
        name: k,
        attributeType: typeHints[k]
      };
    } else {
      return {
        name: k,
        attributeType: getAttributeType(typeof record[k])
      };
    }
  });
  return new BaseDataRecord(attributes,record, id ? id : "record-"+uuid.v4());
}

// turn a given data record into a JSON object
export function dataRecordToJson(r: BaseDataRecord): Record<string, ValueType | null> {
  return r.values;
}

// assuming the TypeScript JSON import was used to create the JSON object
export function jsonObjectToDataset(datasetObject: Record<string, ValueType | null>[], name: string = null, typeHints: Record<string, AttributeType> = {}): BaseDataset {
  const keys: string[] = Object.keys(datasetObject);
  if(keys.indexOf("default") >= 0) {
    keys.splice(keys.indexOf("default"),1); // get rid of 'default'
  }
  const records: DataRecord[] = keys.map((k) => jsonToDataRecord(datasetObject[k],null,typeHints));
  return new BaseDataset(name ? name : "dataset-"+uuid.v4(),records);
}

// data tuple
export class BaseDataRecord implements DataRecord {
  attributes: Attribute[];
  values: Record<string, ValueType | null>;
  id: string;

  constructor(attributes: Attribute[],values: Record<string, ValueType | null>,id: string) {
    if(attributes.length !== Object.keys(values).length) {
      throw new Error('Error creating new DataRecord: attributes and values are not the same length.');
    }
    this.attributes = attributes;
    this.values = values;
    this.id = id;
  }

  // retrieve the value for attribute with the given name
  getValueByName(name: string): ValueType {
    return name in this.values ? this.values[name] : null;
  }

  getValueByIndex(index: number): ValueType {
    return index >= 0 && index < this.attributes.length ? this.values[this.attributes[index].name] : null;
  }

  // create a string representing this record, for hashing and comparison purposes
  hash(): string {
    const rec: Record<string, unknown> = {
      attributes: this.attributes,
      values: this.values,
      id: this.id
    };
    return smartStringify(rec);
  }
}

export interface Dataset {
  name: string;
  records: DataRecord[];
  sources?: Dataset[]; // which datasets were used to create this one?
  // does this dataset overlap with the other dataset?
  compareCoverage?: (otherDataset: Dataset) => { overlap: Dataset, percentOverlap: Record<string, number> };
  subsumes?: (otherDataset: Dataset) => boolean; // does this dataset subsume the other dataset?
}

// given a list of datasets, make them enumerable for use with wildcards
export class DatasetWildcard {
  name: string;
  datasetRegistry: RegistryWildcard<Dataset>;

  constructor(name: string, datasets: Registry<Dataset>) {
    this.name = name;
    this.datasetRegistry = new RegistryWildcard<Dataset>(name, datasets);
  }

  *enumerate(): Generator<Dataset> {
    yield* this.datasetRegistry.enumerate();
  }
}

// holds a collection of records
// want to compare them for coverage
export class BaseDataset implements Dataset {
  name: string;
  records: DataRecord[];
  sources?: Dataset[];

  constructor(name: string, records: DataRecord[]) {
    this.name = name;
    this.records = records;
  }

  // does this dataset fully cover the other dataset?
  subsumes(otherDataset: Dataset): boolean {
    const {overlap} = this.compareCoverage(otherDataset);
    return overlap.records.length === otherDataset.records.length;
  }

  // are there overlapping records between this dataset and the other dataset?
  compareCoverage(otherDataset: Dataset): { overlap: Dataset, percentOverlap: Record<string, number> } {
    const recordMap: Record<string, boolean> = this.records.reduce((acc,r) => { acc[r.hash()] = true; return acc; },{});
    const overlap: Dataset = {
      name: "overlap",
      records: [],
      sources: [this, otherDataset]
    };
    otherDataset.records.forEach((r: DataRecord) => {
      if(r.hash() in recordMap) {
        overlap.records.push(r);
      }
    });
    const percentOverlap: Record<string, number> = {};
    percentOverlap[this.name] = 1.0 * overlap.records.length / this.records.length;
    percentOverlap[otherDataset.name] = 1.0 * overlap.records.length / otherDataset.records.length;
    return {
      overlap: overlap,
      percentOverlap: percentOverlap
    };
  }
}

