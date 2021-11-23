import { ValueType } from './dataset'

// takes a list of items and converts them to a list of integers, along with
// the mapping from value to integer. Only uses as many integers as there are
// unique values (i.e., model classes).  The index position of the target value
// in the mapping array is the desired output integer equivalent.
export function convertToIntegers(items: ValueType[]): { mapped: number[], mapping: ValueType[] } {
  const mapped: number[] = [];
  const mapping: ValueType[] = [];
  for(let i = 0; i < items.length; i++) {
    const key = items[i];
    const idx = mapping.indexOf(key);
    if(idx >= 0) {
      mapped.push(idx);
    } else { // need a new label
      mapped.push(mapping.length);
      mapping.push(key);
    }
  }
  return { mapped, mapping };
}

// creates an object with properties ordered alphabetically
export function sortObject(obj: Record<string, unknown>): Record<string, unknown> {
  if(typeof obj !== "object" || !obj) {
    return obj;
  }
  const res = Object.keys(obj).sort().reduce((acc,k) => { acc[k] = obj[k]; return acc; },{});
  for(const key in res) {
    res[key] = sortObject(res[key]);
  }
  return res;
}

// make sure the object is returned as a string with properties in a consistent order
export function smartStringify(obj: Record<string, unknown>): string {
  return JSON.stringify(sortObject(obj));
}
