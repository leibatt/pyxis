import { sortObject, smartStringify, convertToIntegers } from '../src/util';

describe("#convertToIntegers", () => {
  test("produces valid mappings", () => {
    const input = [3,3,null,1,1,1,50];
    const { mapped, mapping } = convertToIntegers(input);
    expect(mapping).toHaveLength(4);
    expect(mapping).toEqual([3,null,1,50]);
    expect(mapped).toEqual([0,0,1,2,2,2,3]);
  });
});
describe("#sortObject", () => {
  test("basic types are returned as-is", () => {
    const vals: Record<string, unknown>[] = [{d:"c"},{d:1},{d:null},{d:undefined},{d:true}];
    vals.forEach((v) => {
      const sortedV = sortObject(v);
      expect(sortedV).toEqual(v);
    });
  });
  test("keys are in sorted order for a flat object", () => {
    const keys = ["c","b","a"];
    const obj = {};
    for(let i = 0; i < keys.length; i++) {
      obj[keys[i]] = true;
    }
    const keysSorted = keys.sort();
    const objSortedKeys = Object.keys(sortObject(obj));
    objSortedKeys.forEach((k,i) => { expect(k).toEqual(keysSorted[i]); });
  });
  test("keys are in sorted order for a 2-level object", () => {
    const keys = ["c","b","a"];
    const obj = {"test2": false, "test1": {}};
    for(let i = 0; i < keys.length; i++) {
      obj["test1"][keys[i]] = true;
    }
    const res: Record<string, unknown> = sortObject(obj);
    const l1keys: string[] = Object.keys(res);
    expect(l1keys[0]).toBe("test1");
    expect(l1keys[1]).toBe("test2");

    const keysSorted: string[] = keys.sort();
    const objSortedKeys: string[] = Object.keys(res["test1"]);
    objSortedKeys.forEach((k,i) => { expect(k).toEqual(keysSorted[i]); });
  });
});

describe("#smartStringify", () => {
  test("{b: false, a: false} => \"{\"a\":false,\"b\":false}\"", () => {
    const obj: Record<string, unknown> = {};
    obj.b = false;
    obj.a = false;
    expect(smartStringify(obj)).toBe("{\"a\":false,\"b\":false}");
  });
});
