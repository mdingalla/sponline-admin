import {sp, RenderListDataOptions, RenderListDataParameters, ContentType, Web, CamlQuery} from '@pnp/sp'
import { SPCostCenterRequest } from '../../types/models';


import CerAPI from "./cerApi";
import ManpowerApi from "./manpowerApi";
import PettyCashApi from "./pettyCashApi";
import SupplierApi from "./supplierApi";
import TravelApi from "./travelApi";
import UserAccessApi from "./userAcessApi";

const PLANTMASTER = "PlantMaster";

let url = window.location.protocol + "//iconnect.interplex.com";
let siteColWeb = new Web(url);



export {
  CerAPI,
  ManpowerApi,
  SupplierApi,
  TravelApi,
  UserAccessApi,
  PettyCashApi,
  
};
