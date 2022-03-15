/*
When importing a measure it should be a named import and added to the measures object below so that it routes correctly
the key should be the measure id as a string (with '-XX' included) 
*/

import { AMMAD } from "./AMMAD";
import { CCWAD } from "./CCWAD";
import { CCPAD } from "./CCPAD";
import { CPAAD } from "./CPAAD";
import { CPCCH } from "./CPCCH";
import { FUAAD } from "./FUAAD";
import { FUMAD } from "./FUMAD";
import { IETAD } from "./IETAD";
import { LBWCH } from "./LBWCH";
import { LRCDCH } from "./LRCDCH";
import { MSCAD } from "./MSCAD";
import { OUDAD } from "./OUDAD";
import { NCIDDSAD } from "./NCIDDSAD";
import { PDENTCH } from "./PDENTCH";
import { PQI08AD } from "./PQI08AD";
import { PQI01AD } from "./PQI01AD";
import { PQI15AD } from "./PQI15AD";
import { PQI05AD } from "./PQI05AD";

const twentyTwentyOneMeasures = {
  "AMM-AD": AMMAD,
  "CCP-AD": CCPAD,
  "CCW-AD": CCWAD,
  "CPA-AD": CPAAD,
  "CPC-CH": CPCCH,
  "FUA-AD": FUAAD,
  "FUM-AD": FUMAD,
  "IET-AD": IETAD,
  "LBW-CH": LBWCH,
  "LRCD-CH": LRCDCH,
  "MSC-AD": MSCAD,
  "NCIDDS-AD": NCIDDSAD,
  "OUD-AD": OUDAD,
  "PDENT-CH": PDENTCH,
  "PQI01-AD": PQI01AD,
  "PQI05-AD": PQI05AD,
  "PQI08-AD": PQI08AD,
  "PQI15-AD": PQI15AD,
};

export default twentyTwentyOneMeasures;
