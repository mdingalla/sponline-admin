import { TodoFilterType, ReactSelectValue, WFlowStatus } from "../../types/models";

export const SHOW_ALL: TodoFilterType = 'SHOW_ALL';
export const SHOW_ACTIVE: TodoFilterType = 'SHOW_ACTIVE';
export const SHOW_COMPLETED: TodoFilterType = 'SHOW_COMPLETED';

export const FILTER_TYPES = [
  SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED
];

export const SPADMIN = "000-SP-TECHNICAL";

export const DRAFT: WFlowStatus = 'DRAFT';
export const NEW: WFlowStatus = 'NEW';
export const PENDING: WFlowStatus = 'PENDING';
export const APPROVED: WFlowStatus = 'APPROVED';
export const REJECTED:WFlowStatus = 'REJECTED';
export const COMPLETED:WFlowStatus = 'COMPLETED';
export const CANCELED:WFlowStatus = 'CANCELED';
export const WITHDRAW:WFlowStatus = 'WITHDRAW';

export const WFLOWSTATUS = [
  DRAFT, NEW,
PENDING,
APPROVED,
REJECTED,
COMPLETED,
CANCELED
]

export const SAP = 'SAP';
export const COGNOS = 'COGNOS';
export const TAPPLENT = 'TAPPLENT';
export const PAYROLL = 'PAYROLL';

export const ACKNOWLEDGEAPPS = [
  SAP,COGNOS,TAPPLENT,PAYROLL
]




export const HSITE = 'Site';
export const HCORPORATE = 'Corporate';
export const HREGIONAL = 'Regional';
export const HTECH = 'Tech';

export const CCHierarchy = [
HCORPORATE,HREGIONAL,HSITE,HTECH
]

export const RNorthAmerica = 'NORTH AMERICA';
export const RAsia = 'ASIA';
export const RChina = 'CHINA';
export const REurope = 'EUROPE'

export const CCRegion = [
  RAsia,RChina,REurope,RNorthAmerica
]


export const Factory = "Factory"
export const RD = 'R&D'
export const GA = 'G&A'
export const SM = 'S&M'
export const FACTORY = 'Factory'

export const CCFUnction = [
  GA,RD,SM,FACTORY
]


export const Others = 'Others'
export const Automotive = 'Automotive'
export const ColdForging = 'Cold Forging'
export const MEDICAL = 'MEDICAL'
export const IES = 'IES';
export const TBU = 'TBU';

export const CCSegment = [
  Automotive,ColdForging,IES,MEDICAL,TBU,Others
]


export const EmptyReactSelectValue:ReactSelectValue = {
  label:'',value:''
}