import { IPersonaProps } from "office-ui-fabric-react/lib-es2015/Persona";
import { SAP, COGNOS, TAPPLENT, PAYROLL } from "../src/constants/filters";

declare interface IRenderListDataAsStreamResult {
  Row:any[]
}

/** TodoMVC model definitions **/
declare interface ReactSelectValue {
  value: string;
  label: string;
}

declare interface TodoItemData {
  id?: TodoItemId;
  text?: string;
  completed?: boolean;
}

declare type VendorStoreState = {
  alphabets: string[];
};

declare type WFlowStatus =
  | "DRAFT"
  | "NEW"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELED"
  | "WITHDRAW";


declare type TodoItemId = number;

declare type TodoFilterType = "SHOW_ALL" | "SHOW_ACTIVE" | "SHOW_COMPLETED";

declare type TodoStoreState = TodoItemData[];

declare type SharePointAppType =
  | "TR"
  | "PTC"
  | "CER"
  | "ADT"
  | "UA"
  | "VENDOR"
  | "MANPOWER";

declare interface StaffMaster {
  id: number;
}

declare interface SPUser {
  Id: number;
  LoginName: string;
  Email: string;
  
}

declare interface SharePointSPSUser extends SPUser {
  // Email:string,Id:number,Title:string,LoginName:string;
  Title: string;
  Groups: SPRestResult;
}

declare interface SPRestResult {
  results: SPItem[];
}
declare interface SPItem {
  Id: number;
  Title: string;
}

declare interface AppProfile {
  User: SharePointSPSUser;
  Staff: StaffMaster;
  IsAdmin:boolean;
}
/** Travel Request model definitions **/

declare interface TravelRequestItemData {
  id?: number;
  requestor?: any;
  author?: AppProfile;
  isOnBehalf?: boolean;
}

declare interface SharePointRestResult {
  results: StaffMasterADData[];
  __next?: string;
}

declare interface StaffMasterADData {
  Id: any;
  Status: string;
  User?: string;
  WindowsID?: any;
}

declare interface APPSearchResultData {
  Id: number;
  Title: string;
  ClickLink: string;
  App: string;
}

declare interface APPSearchResult {
  PTC: APPSearchResultData[];
  TR: APPSearchResultData[];
  CER: APPSearchResultData[];
  UA: APPSearchResultData[];
  ADT: APPSearchResultData[];
  VENDOR: APPSearchResultData[];
  MANPOWER: APPSearchResultData[];
  GL: APPSearchResultData[];
  TRDetails: APPSearchResultData[];
  searching: boolean;
}

declare interface SharePointSPSUser {
  Email: string;
  Id: number;
  Title: string;
  LoginName: string;
}

declare interface UserSearchResult {
  spdata?: any;
  staffmasterdata?: any;
  searching: boolean;
}

declare interface GLReportItems {
  glaccounts: any[];
  data: any[];
  querying: boolean;
}

declare interface GLItem {
  Amount: number;
  GLAccount: string;
  ClaimType: string;
  BusinessArea: string;
  Department: string;
  CostCentre: string;
  Title: string;
  Curr: string;
  EmpNo: string;
  PayTo: string;
  DteExpenseDate: Date;
  Method: string;
  ExpenseCategory?: string;
  Employee?: string;
  DateExpenseValue?:any;
  EmpName?:string;
  // NewDate?:Date;
}

declare interface CERReportItems {
  startDt?:any;
  endDt?:any;
  cerData: any[];
  plants?: any[];
  assetcategories?: any[];
  cerstatus?: any[];
  selectedAssetCategory?: string;
  selectedPlant?: string;
  selectedStatus?: string;
  assignedTo?:IPersonaProps[];
  querying: boolean;
}

declare interface CERRptItem {
  Title: string;
  Plant: string;
  Project: string;
  Description: string;
  TotalAmount: string;
  Qty: number;
  AssetCategory: string;
  Modified: string;
  CERStatus: string;
  AssetNumber: string;
  PONumber: string;
  CostCenter: string;
}

declare interface MedicalReportViewModel {
  data: MedicalReportItem[];
  plants?: any[];
  selectedPlant?: string;
  querying: boolean;
}

declare interface MedicalReportItem {
  Employee: string;
  EmpNo: string;
  MedicalClaim: number;
  MedicalBalance: number;
  MedicalCap: number;
}

declare interface ReactSelectValue {
  value: string;
  label: string;
}


declare interface CostCenterRequestPage {
  request:Partial<CostCenterRequest>
  pageState?: ValidationResult;
}

declare interface ValidationResult { valid: boolean; errors: ValidationResult[] }

declare interface AcknowledgeAPPS {
  title?:string;
  pplId?:number[];
  date?:Date;
  comments?:string;
  isComplete:boolean;
}




declare interface CostCenterRequest {
  id?:number;
  isNew:boolean;
  costcentre:ReactSelectValue;
  costcentretext:string;
  costcentrenametext?:string;
  purpose:string;
  plant:ReactSelectValue;
  owner:IPersonaProps[];
  Hierarchy:ReactSelectValue;
  title:string;
  hasHeadcount:boolean;
  region:ReactSelectValue;
  ccgroup:ReactSelectValue;
  segment:ReactSelectValue;
  function:ReactSelectValue;
  requestor?: IPersonaProps[];
  oregion?:string;
  occgroup?:string;
  osegment?:string;
  ohasHeadCount?:boolean;
  ofunction?:string;
  ohierarchy?:string;
  approvecomments?:string;
  acknowledgements?:AcknowledgeAPPS[];
  wflowcounter?:number;
  wflowmessage?:string;
  wflowstatus?:WFlowStatus;
  MultiAssignedToId?:PeopleMultiPickerClass;
  isWorkflow?:boolean;
}

declare interface PeopleMultiPickerClass {
  results:number[]
}


declare interface SPCostCenterRequest {
  Id?:number;
  Title?:string;
  CostCentre:string;
  CostCentreName?:string;
  RequestorId?:number;
  // PlantMasterRefId:number;
  PlantMasterReferenceId:number;
  RequestPurpose:string;
  CostCenterOwnerId:number;
  Hierarchy:string;
  OHierarchy?:string;
  Region:string;
  ORegion:string;
  CCGroup:string;
  OCCGroup?:string;
  Function:string;
  OFunction?:string;
  Segment:string;
  OSegment?:string;
  HasHeadCount:boolean;
  OHasHeadCount?:boolean;
  IsNew:boolean;
  WFlowStatus:WFlowStatus;
  Approved1ById?:any;
  Approved2ById?:any;
  ApprovedByRemarks?:string;
  ApprovedByDate?:string;
  Approved2ByDate?:string;
  IsWorkflow:boolean;
  MultiAssignedToId?:any;
  "ACKPPLSAPId"?: any,
  "ACKPPLCOGNOSId"?: any,
  "ACKPPLTAPPLENTId"?: any,
  "ACKPPLPAYROLLId"?: any,
  "ACKPPLSAPDATE"?: string,
  "ACKPPLCOGNOSDATE"?: string,
  "ACKPPLTAPPLENTDATE"?: string,
  "ACKPPLPAYROLLDATE"?: string,
  "ACKPPLSAPCOMMENTS"?: string,
  "ACKPPLCOGNOSCOMMENTS"?: string,
  "ACKPPLTAPPLENTCOMMENTS"?: string,
  "ACKPPLPAYROLLCOMMENTS"?: string,
  WFlowCounter?:number,
  WFlowMessage?:string
}

declare interface GLReportItems {
  glaccounts: any[];
  data: any[];
  querying: boolean;
}