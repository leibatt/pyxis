
export enum AttributeType {
  nominal = "nominal",
  ordinal = "ordinal",
  quantitative = "quantitative",
  temporal = "temporal"
}

export interface Attribute {
  name: string;
  attributeType: AttributeType;
}

export type ValueType = string | boolean | number;

// data tuple
export class DataRecord {
  attributes: Attribute[];
  values: ValueType[];
  id: number;

  constructor(attributes: Attribute[],values: ValueType[],id: number) {
    if(attributes.length !== values.length) {
      throw new Error('Error creating new DataRecord: attribute and value arrays are not the same length.');
    }
    this.attributes = attributes;
    this.values = values;
    this.id = id;
  }

  getValueByName(name: string): ValueType {
    const index: number = this.attributes.map(a => a.name).indexOf(name);
    return index >= 0 ? this.values[index] : null;
  }

  getValueByIndex(index: number): ValueType {
    return index >= 0 && index < this.attributes.length ? this.values[index] : null;
  }

  hash(): string {
    const hashArray: string[] = []; 
    for(let i = 0; i < this.attributes.length; i++) {
      const a: Attribute = this.attributes[i];
      const v: ValueType = this.values[i];
      hashArray.push(a+",");
      hashArray.push(v+",");
      // TODO: finish the hash function.
    }
    return "";
  }

}

export interface BaseDataset {
  name: string;
  records: DataRecord[];
  compareCoverage(otherDataRecords: DataRecord[]): { overlap: DataRecord[], percentCoverage: number };
}

// holds a collection of records
// want to compare them for coverage
/*
export class Dataset implements BaseDataset {
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

