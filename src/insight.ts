import {Record,Attribute,ValueType} from './dataset';

export enum RelationshipType {
  Interesting = 1,
  Related,
  Influences
}

export interface RelationshipModel {
  inputAttributes?: Attribute[];
  outputAttributes?: Attribute[];
  train(trainingSet: Record[]): void;
  predict(record: Record): ValueType;
}

// this group of records is meaningful/interesting somehow
export class Cluster {
  records: Record[];
  relationship: RelationshipModel;

  constructor(records: Record[], relationship: RelationshipModel) {
    this.records = records;
    this.relationship = relationship;
  }
}

// clustering, correlation, outliers

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
  attributes: Attribute[];
  records: Record[];

  constructor(attributes: Attribute[], records: Record[]) {
    this.attributes = attributes;
    this.records = records;
  }
}

export class CausalRelationship {
  attributes: Attribute[];
  inputRecords: Record[];
  outputRecords: Record[];

  constructor(attributes: Attribute[], inputRecords: Record[], outputRecords: Record[]) {
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

