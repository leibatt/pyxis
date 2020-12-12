import * as uuid from 'uuid';
import {smartStringify} from './util';

export enum AttributeType {
  nominal = "nominal",
  ordinal = "ordinal",
  quantitative = "quantitative",
  temporal = "temporal"
}

// sets attribute type by default, may not get things right for ordinal
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

export function getAttributeType(t: string) {
  return AttributeTypeMapping[t];
}

export interface Attribute {
  name: string; // name of the attribute
  attributeType: AttributeType; // what type of attribute?
  dependences?: Attribute[]; // does the value of this attribute depend on other attributes?
  computed?: boolean; // did code generate this attribute?
}

// types of data values within an attribute
export type ValueType = string | boolean | number | bigint;

export interface DataRecord {
  attributes: Attribute[]; // the attributes stored in this record
  values: (ValueType | null)[]; // the values stored in this record, one per attribute, can be null
  id: string; // unique identifier for this record
  hash?: () => string;
}

export function jsonToDataRecord(record: Record<string, ValueType | null>, id: string = null): DataRecord {
  const attributes: Attribute[] = (Object.keys(record)).map((k) => {
    return {
      name: k,
      attributeType: getAttributeType(typeof record[k])
    };
  });
  return new BaseDataRecord(attributes,attributes.map((a) => record[a.name]), id ? id : uuid.v4());
}

// data tuple
export class BaseDataRecord implements DataRecord {
  attributes: Attribute[];
  values: ValueType[];
  id: string;

  constructor(attributes: Attribute[],values: ValueType[],id: string) {
    if(attributes.length !== values.length) {
      throw new Error('Error creating new DataRecord: attribute and value arrays are not the same length.');
    }
    this.attributes = attributes;
    this.values = values;
    this.id = id;
  }

  // retrieve the value for attribute with the given name
  getValueByName(name: string): ValueType {
    const index: number = this.attributes.map(a => a.name).indexOf(name);
    return index >= 0 ? this.values[index] : null;
  }

  // retrieve the value for attribute at the given index
  getValueByIndex(index: number): ValueType {
    return index >= 0 && index < this.attributes.length ? this.values[index] : null;
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
    const {overlap,percentOverlap} = this.compareCoverage(otherDataset);
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

