import * as aq from 'arquero';
import { DataTransformation } from './DataTransformation';
import {ValueType, BaseDataRecord, BaseDataset, Dataset, jsonToDataRecord, dataRecordToJson} from '../dataset';

// first dataset should be the initial source
export interface ArqueroDataTransformation extends DataTransformation {
  transforms: VerbWrapper[];
}

export interface VerbWrapper {
  op: string; // verb name
  args: any[]; // arguments to pass to op
  toJoin?: BaseDataset; // join arg to pass to op
}

// given a list of Arquero verbs, this function will apply the verbs to
// the given Dataset and return a new dataset with the verbs applied.
// The result of the last verb is returned. Join inputs have to be specified separately.
export function executeDataTransformation(transformation: ArqueroDataTransformation): BaseDataset {
  let prev: aq.internal.ColumnTable = getArqueroTable(transformation.sources[0]); // first dataset should be the initial source
  let curr: aq.internal.ColumnTable = null;
  // for each op, execute the op with the result of the previous op
  for(let i = 0; i < transformation.transforms.length; i++) {
    curr = processVerb(prev, transformation.transforms[i]);
    prev = curr;
  }
  // translate back to our format
  const newRecords: BaseDataRecord[] = curr.objects().map((r: Record<string,ValueType>) => jsonToDataRecord(r));
  return new BaseDataset(transformation.transforms.map(v => v.op).join("-"), newRecords);
}

// translate a Dataset object to Arquero format
function getArqueroTable (d: Dataset): aq.internal.ColumnTable {
  return aq.from(d.records.map(dataRecordToJson));
}

// execute one Arquero verb, keep in Arquero format
function processVerb(dt: aq.internal.ColumnTable, v: VerbWrapper): aq.internal.ColumnTable {
  let args = [...v.args];
  if(v.op.includes("join")) { // are we doing a join?
    const toJoin: aq.internal.ColumnTable = getArqueroTable(v.toJoin);
    args = [toJoin,...args]; // make sure the second source is in the join args
  }

  // execute op
  return aq.internal.ColumnTable = dt[v.op](...args);
}

