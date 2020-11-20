
// TODO: move the below sections to separate .ts files

/*********************************** BEGIN DATA MANAGEMENT ***************************************/

// data tuple
export class Record {
  attributes: string[];
  values: any[];

  constructor(attributes: string[],values: any[]) {
    if(attributes.length !== values.length) {
      throw new Error('Error creating new Record: attribute and value arrays are not the same length.');
    }
    this.attributes = attributes;
    this.values = values;
  }

  getValueByName(name: string): any {
    const index: number = this.attributes.indexOf(name);
    return index >= 0 ? this.values[index] : null;
  }

  getValueByIndex(index: number): any {
    return index >= 0 && index < this.attributes.length ? this.values[index] : null;
  }

  equalTo(otherRecord: Record): boolean {
    // TODO: fill this in.
    // idea is to eventually be able to compare collections of records (i.e., Datasets)
    return false;
  }

}

// holds a collection of records
// want to compare them for coverage
export class Dataset {
  records: Record[];

  constructor(records: Record[]) {
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

/*********************************** END DATA MANAGEMENT ***************************************/

/*********************************** BEGIN DATA RELATIONSHIPS ***************************************/

enum RelationshipType {
  Interesting = 1,
  Related,
  Influences
}

// this group of records is interesting somehow
export class InterestingRelationship {
  records: Record[];

  constructor(records: Record[]) {
    this.records = records;
  }
}

//
// TODO: create this class 
// specify clusters here somehow, how are they defined? Are they
// manually separated? Denoted by a particular attribute or set of
// attributes?
// export class ClustersRelationship {
// 
// }

// there seems to be a relationship across this group of records, defined by
// the given set of attributes
export class RelatedRelationship {
  attributes: string[];
  records: Record[];

  constructor(attributes: string[], records: Record[]) {
    this.attributes = attributes;
    this.records = records;
  }
}

export class CausalRelationship {
  attributes: string[];
  inputRecords: Record[];
  outputRecords: Record[];

  constructor(attributes: string[], inputRecords: Record[], outputRecords: Record[]) {
    this.attributes = attributes;
    this.inputRecords = inputRecords;
    this.outputRecords = outputRecords;
  }
}

// TODO: create this class
// export class Insight {
//   
// 
// }

/*********************************** END DATA RELATIONSHIPS ***************************************/


