import * as aq from 'arquero';
import { DataTransformation } from './DataTransformation';
import {ValueType, BaseDataRecord, BaseDataset, Dataset, jsonToDataRecord, dataRecordToJson} from '../dataset';

// first dataset should be the initial source
export interface ArqueroDataTransformation extends DataTransformation {
  transforms: Verb[];
}

export interface Verb {
  op: string; // verb name
  args: any[]; // arguments to pass to op
  toJoin?: BaseDataset; // join arg to pass to op
}

// given a list of Arquero verbs, this function will apply the verbs to
// the given Dataset and return a new dataset with the verbs applied.
// The result of the last verb is returned. Join inputs have to be specified separately.
export function executeDataTransformation(transformation: ArqueroDataTransformation): BaseDataset {
  let prev: Dataset = transformation.sources[0]; // first dataset should be the initial source
  let curr: BaseDataset = null;
  // for each op, execute the op with the result of the previous op
  for(let i = 0; i < transformation.transforms.length; i++) {
    curr = processVerb(prev, transformation.transforms[i]);
    prev = curr;
  }
  return curr;
}

// translate a Dataset object to Arquero format
function getArqueroTable (d: Dataset): aq.internal.ColumnTable {
  return aq.from(d.records.map(dataRecordToJson));
}

// execute one Arquero verb
export function processVerb(d: Dataset, v: Verb): BaseDataset {
  // translate to arquero format
  const dt: aq.internal.ColumnTable = getArqueroTable(d);

  const nameList: string[]  = [d.name];
  let toJoin: aq.internal.ColumnTable = null;
  let args = [...v.args];
  if(v.op.includes("join")) { // are we doing a join?
    toJoin = getArqueroTable(v.toJoin);
    nameList.push(v.toJoin.name);
    args = [toJoin,...args]; // make sure the second source is in the join args
  }
  nameList.push(v.op);

  // execute op
  const dt2 = dt[v.op](...args);

  // translate back to our format
  const newRecords: BaseDataRecord[] = dt2.objects().map((r: Record<string,ValueType>) => jsonToDataRecord(r));
  return new BaseDataset(nameList.join("-"), newRecords);
}
