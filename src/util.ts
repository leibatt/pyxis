
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
