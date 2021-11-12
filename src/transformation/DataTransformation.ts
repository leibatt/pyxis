import { Dataset } from '../dataset';

export interface DataTransformation {
  sources: Dataset[]; // all sources involved in the data transformations
  ops: string[]; // a list of the names of the data transformations to be performed
}
