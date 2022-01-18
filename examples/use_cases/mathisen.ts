import * as baltimoreCrimeRaw from '../../datasets/BPD_Part_1_Victim_Based_Crime_Data2.json';
import { Attribute, BaseDataset, jsonObjectToDataset } from '../../src/dataset';

// In this example, we will be recreating the Baltimore crime data investigation
// scenario proposed by Mathisen et al.:
// Mathisen, A., Horak, T., Klokmose, C.N., Grønbæk, K. and Elmqvist, N., 2019,
// June. InsideInsights: Integrating Data‐Driven Reporting in Collaborative
// Visual Analytics. In Computer Graphics Forum (Vol. 38, No. 3, pp. 649-661).

// We will use the (old) Baltimore Crime dataset in this example (see
// README for source details).  As a pre-processing step, we need to change the
// date strings to actual dates.
//for(let i = 0; i < baltimoreCrimeRaw.length; i++) {
//  baltimoreCrimeRaw[i]["CrimeDate"] = new Date(baltimoreCrimeRaw[i]["CrimeDate"])
//}
// Now load into our BaseDataset object
//const baltimoreCrime: BaseDataset = jsonObjectToDataset(baltimoreCrimeRaw,"Baltimore Crime 2012 - 2017");



