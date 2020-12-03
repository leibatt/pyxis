import {sortObject, smartStringify} from '../src/util';

describe("#sortObject", () => {
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
    expect(l1keys[0]).toEqual("test1");
    expect(l1keys[1]).toEqual("test2");

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
    expect(smartStringify(obj)).toEqual("{\"a\":false,\"b\":false}");
  });
});
