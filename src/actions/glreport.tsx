import { createAction } from "redux-actions";
import * as moment from "moment";
import * as Actions from "../constants/actions";
import StaffMasterApi from "../sharepointapi/staffMasterApi";
import * as pnp from "sp-pnp-js";
import { sp } from "sp-pnp-js/lib/pnp";
import { RootState } from "../reducers";
import {
  CerAPI,
  ManpowerApi,
  SupplierApi,
  TravelApi,
  UserAccessApi,
  PettyCashApi
} from "../sharepointapi/iconnectApi";
import { start } from "repl";
import { GLItem, GLReportItems } from "../../types/models";

const myurl = _spPageContextInfo.siteAbsoluteUrl;

export const getGLItems = createAction<GLReportItems>(Actions.GET_GL_REPORT);

export function queryGLItems() {
  return function(dispatch) {
    let startDt = new Date();
    let pmonth = startDt.getMonth();
    let pday = startDt.getDay();
    let endDt = new Date(startDt.getFullYear(), pmonth - 3, pday);
    dispatch(queryGL(startDt, endDt));
  };
}

export function queryGL(startDt: Date, endDt: Date) {
  let glData: GLItem[] = [];
  return function(dispatch, getState) {
    // console.log(getState());
    PettyCashApi.GetGLDescriptions().then(glaccounts => {
      PettyCashApi.GLReportQuery(startDt, endDt).then(async d => {
        glData.push(...d);
        dispatch(
          getGLItems({
            data: glData,
            querying: true,
            glaccounts: glaccounts
          })
        );

        let returnData: GLItem[] = glData
          .reduce((q, r, v) => {
            q.push({
              ...r,
              ExpenseCategory: mapExpenseCategory(glaccounts, r),
              Employee: r.PayTo
              // DteExpenseDate:new Date(r.DteExpenseDate)
            });
            return q;
          }, [])

        // let mdata = returnData.filter((p)=>{
        //    return  startDt >= p.DteExpenseDate   && endDt <= p.DteExpenseDate
        // });

        dispatch(
          getGLItems({
            data: returnData,
            querying: false,
            glaccounts
          })
        );
      });
    });
  };
}

export function queryGL2(startDt: Date, endDt: Date) {
  let glData: GLItem[] = [];
  return function(dispatch, getState) {
    // console.log(getState());
    PettyCashApi.GetGLDescriptions().then(glaccounts => {
      PettyCashApi.GLReportQuery2(startDt, endDt).then(async d => {
        glData.push(...d.results);
        dispatch(
          getGLItems({
            data: glData,
            querying: true,
            glaccounts: glaccounts
          })
        );
        if (d.hasNext) {
          await PettyCashApi.getNextCall(d.getNext(), glData);
        }

        let returnData: GLItem[] = glData
          .reduce((q, r, v) => {
            q.push({
              ...r,
              ExpenseCategory: mapExpenseCategory(glaccounts, r),
              Employee: r.PayTo
              // DteExpenseDate:new Date(r.DteExpenseDate)
            });
            return q;
          }, [])
          .filter(p => {
            // return  startDt <= new Date(p.DteExpenseDate)   && endDt >=  new Date(p.DteExpenseDate)
            // return  startDt <= new Date(p.ExpenseDate) && endDt >=  new Date(p.ExpenseDate)
            return (
              moment(p.ExpenseDate, "DD/MM/YYYY").isAfter(moment(startDt)) &&
              moment(p.ExpenseDate, "DD/MM/YYYY").isBefore(moment(endDt))
            );
          });

        // let mdata = returnData.filter((p)=>{
        //    return  startDt >= p.DteExpenseDate   && endDt <= p.DteExpenseDate
        // });

        dispatch(
          getGLItems({
            data: returnData,
            querying: false,
            glaccounts
          })
        );
      });
    });
  };
}


export function queryNewGL(startDt: Date, endDt: Date) {
  let glData: GLItem[] = [];
  return function(dispatch, getState) {
    // console.log(getState());
    PettyCashApi.GetGLDescriptions().then(glaccounts => {
      dispatch(
        getGLItems({
          data: [],
          querying: true,
          glaccounts: []
        })
      );

      PettyCashApi.GLReportCamlQuery(startDt, endDt).then(async d => {
        glData.push(...d.Row);

        let returnData: GLItem[] = glData
        .reduce((q, r, v) => {
          q.push({
            Amount: r.Amount,
            GLAccount: r.GLAccount,
            ClaimType: r.ClaimType,
            BusinessArea: r.BusinessArea,
            Department: r.Department,
            CostCentre: r.CostCentre,
            Title: r.Title,
            Curr: r.Curr,
            EmpNo: r.EmpNo,
            PayTo: r.EmpName,
            DteExpenseDate: new Date(r.DateExpenseValue.calculated),
            Method: r.Method,
            Employee: r.EmpName,
            ExpenseCategory: mapExpenseCategory(glaccounts, r),
            // DteExpenseDate:new Date(r.DteExpenseDate)
          });
          return q;
        }, [])

        dispatch(
          getGLItems({
            data: returnData,
            querying: false,
            glaccounts
          })
        );
      });
    });
  };
}

function mapExpenseCategory(glaccounts: any[], item: GLItem) {
  if (item.GLAccount) {
    let result = glaccounts.filter(x => x.GLCode == item.GLAccount);
    if (result && result.length > 0) {
      return result[0].ExpenseCategory;
    }
  }
}
