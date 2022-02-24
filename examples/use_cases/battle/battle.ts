import { op, desc } from 'arquero';
import { loadDataset, AttributeType, BaseDataset } from '../../src/dataset';
import { ArqueroDataTransformation, executeDataTransformation } from '../../src/transformation/arquero';
import { Concept, DomainKnowledgeNode, Instance, KnowledgeType } from '../../src/knowledge';
import { Evidence } from '../../src/evidence';
import { Insight } from '../../src/insight';

// In this example, we will be recreating participants' answers to tasks
// involving the birdstrikes dataset, studied by Battle & Heer:
// Battle, L. and Heer, J., 2019, June. Characterizing exploratory visual
// analysis: A literature review and evaluation of analytic provenance in
// tableau. In Computer graphics forum (Vol. 38, No. 3, pp. 145-159).

// Please see the README in this folder for more details.

/************ BIRDSTRIKES TASK 1: "Wing/rotor damaged the most" ************/


/************ BIRDSTRIKES TASK 2: "Airplane has more occurrences of severe damage" ************/


/************ BIRDSTRIKES TASK 3: "Incidents occur more in bad weather (ignore clear weather)" ************/
