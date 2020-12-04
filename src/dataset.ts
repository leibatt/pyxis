import {smartStringify} from './util';

export enum AttributeType {
  nominal = "nominal",
  ordinal = "ordinal",
  quantitative = "quantitative",
  temporal = "temporal"
}

export interface Attribute {
  name: string; // name of the attribute
  attributeType: AttributeType; // what type of attribute?
  dependences?: Attribute[]; // does the value of this attribute depend on other attributes?
  computed?: boolean; // did code generate this attribute?
}

// types of data values within an attribute
export type ValueType = string | boolean | number;

export interface DataRecord {
  attributes: Attribute[]; // the attributes stored in this record
  values: ValueType[]; // the values stored in this record, one per attribute
  id: number; // unique identifier for this record
}

// data tuple
export class BaseDataRecord implements DataRecord {
  attributes: Attribute[]; // the attributes stored in this record
  values: ValueType[]; // the values stored in this record, one per attribute
  id: number; // unique identifier for this record

  constructor(attributes: Attribute[],values: ValueType[],id: number) {
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
  compareCoverage(otherDataRecords: DataRecord[]): { overlap: DataRecord[], percentCoverage: number };
}

// holds a collection of records
// want to compare them for coverage
/*
export class BaseDataset implements Dataset {
  constructor(name: string, records: DataRecord[]) {
    this.name = name;
    this.records = records;
  }

  compareCoverage(otherDataRecords: DataRecord[]): { overlap: DataRecord[], percentCoverage: number } {
    // TODO: fill this in
    return {
      overlap: [],
      percentCoverage: 0
    };
  }
}
*/

