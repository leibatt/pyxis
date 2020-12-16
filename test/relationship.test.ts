import {AttributeType} from '../src/dataset';
import {LinearRelationshipModel} from '../src/relationship';

describe('LinearRelationshipModel', () => {
  test('#constructor works', () => {
    const lrm: LinearRelationshipModel = new LinearRelationshipModel(
      "test",
      [ // input attributes
        {
          name: "x",
          attributeType: AttributeType.quantitative
        }
      ],
      { // output attribute
        name: "y",
        attributeType: AttributeType.quantitative
      }
    );
    expect(lrm.name).toEqual("test");
  });
});
