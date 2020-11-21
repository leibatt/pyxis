
export type AttributeType = "nominal" | "ordinal" | "quantitative" | "temporal";

export interface Attribute {
  name: string;
  attributeType: AttributeType;
}

export type ValueType = string | boolean | number;

// data tuple
export class Record {
  attributes: Attribute[];
  values: ValueType[];

  constructor(attributes: Attribute[],values: ValueType[]) {
    if(attributes.length !== values.length) {
      throw new Error('Error creating new Record: attribute and value arrays are not the same length.');
    }
    this.attributes = attributes;
    this.values = values;
  }

  getValueByName(name: string): ValueType {
    const index: number = this.attributes.map(a => a.name).indexOf(name);
    return index >= 0 ? this.values[index] : null;
  }

  getValueByIndex(index: number): ValueType {
    return index >= 0 && index < this.attributes.length ? this.values[index] : null;
  }

  equalTo(otherRecord: Record): boolean {
    // TODO: fill this in.
    // idea is to eventually be able to compare collections of records (i.e., Datasets)
    return false;
  }

}

export interface DatasetInterface {
  name: string;
  records: Record[];
  compareCoverage(otherRecords: Record[]): { overlap: Record[], percentCoverage: number };
}

// holds a collection of records
// want to compare them for coverage
/*
export class Dataset implements DatasetInterface {
  constructor(name: string, records: Record[]) {
    this.name = name;
    this.records = records;
  }

  compareCoverage(otherRecords: Record[]): { overlap: Record[], percentCoverage: number } {
    // TODO: fill this in
    return {
      overlap: [],
      percentCoverage: 0
    };
  }
}
*/

