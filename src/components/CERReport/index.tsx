import * as React from 'react';
import { Form,DatePicker,Layout, Button, Spin} from "antd";
import moment = require("moment");
let alasql = require('alasql');
import * as XLSX from 'xlsx';
import * as style from './style.css';
// import {BootstrapTable,TableHeaderColumn} from 'react-bootstrap-table';


alasql.utils.isBrowserify = false;
alasql.utils.global.XLSX = XLSX;

const columns = [
  {
    dataField: 'Plant',
    text: 'Plant'
  },
  {
    dataField: 'CompanyCode',
    text: 'Company Code'
  },
  {
    dataField: 'PlantCode',
    text: 'Plant Code'
  },

  {
    dataField: 'CREATED FYEAR',
    text: 'CREATED FYEAR'
  },
  // {
  //   dataField: 'MODIFIED FYEAR',
  //   text: 'MODIFIED FYEAR'
  // },
  {
    dataField: 'APPROVED FYEAR',
    text: 'APPROVED FYEAR'
  },
  {
  dataField: 'CER',
  text: 'CER Reference'
},
{
  dataField: 'Status',
  text: 'Status'
},
 {
  dataField: 'BudgetType',
  text: 'BudgetType'
},
{
  dataField:'BudgetIdNo',
  text:'BudgetIdNo'
},
{
  dataField: 'AssetCategory',
  text: 'AssetCategory'
},
 {
  dataField: 'Description',
  text: 'Description'
},
{
  
  dataField: 'Purpose',
  text: 'Purpose'
}, 
{
  dataField: 'CERAMount',
  text: 'CER AMount'
},
{
  dataField: 'Proj ROI/ Payback (Yrs)',
  text: 'Proj ROI/ Payback (Yrs)'
},
{
  dataField: 'ProjectNPV',
  text: 'ProjectNPV'
},
 {
  dataField: 'TotalQuotedAmnt',
  text: 'TotalQuoted'
}, 
{
  dataField: 'ProjectName',
  text: 'Project'
},
{
  dataField: 'ApproveDate',
  text: 'Final Approve Date'
},
{
  dataField: 'IsSupplemental',
  text: 'Supplemental'
},
{
  dataField: 'SupplementalNo',
  text: 'SupplementalNo'
},
{
  dataField: 'Created',
  text: 'Created'
},
{
  dataField: 'Modified',
  text: 'Modified'
},
{
  dataField: 'ApprovedDate',
  text: 'ApprovedDate'
},
{
  dataField: 'AnnualBudget',
  text: 'AnnualBudget'
},
{
  dataField: 'CostCentre',
  text: 'CostCentre'
}
];


const data = [['attribute', 'attribute2'], ['value1', 'value2']];


const { RangePicker } = DatePicker;
const { Header, Footer, Sider, Content } = Layout;

import '!style-loader!css-loader!antd/dist/antd.css';
import CerAPI from '../../sharepointapi/cerApi';
import PlantMaster from '../../sharepointapi/plantMasterApi';
import * as _ from 'lodash';
import SiteCollectionApi from '../../sharepointapi/siteCollection';

export const CERReportPage = ()=> {

    const [date,setDate] = React.useState(null);
    const [data,setData] = React.useState([]);
    const [plants,setPlants] =React.useState([]);
    const [loading,setLoading] = React.useState(false);

    React.useEffect(()=>{
        getPlants();

    },[]);

    const getPlants = async ()=> {
        const plants = await PlantMaster.GetPlants();
        setPlants(plants);
    }

    const onChange = (date, dateString) => {
        setDate(date);
    }

    const getPlantTitle = (id)=> {
        const plant = plants.find(x=>x.Id == id);
        if(plant) return plant.Title;
        return ""
    }

    const getPlantCode = (id)=> {
      const plant = plants.find(x=>x.Id == id);
      if(plant) return plant.Code;
      return ""
  }

  const getPlantCompanyCode = (id)=> {
    const plant = plants.find(x=>x.Id == id);
    if(plant) return plant.CompanyCode;
    return ""
}

    const getPlant = (id)=> {
      const plant = plants.find(x=>x.Id == id);
      if(plant) return plant;
      return null
  }

    function parseAmount(amt){
      if(amt) return parseFloat(amt.toString().replace(/,/g,''))
      return 0;
    }

    const handleALAExcelExport =() => {
        alasql("SELECT Plant,CompanyCode,PlantCode,[CREATED FYEAR],[APPROVED FYEAR],CER,Status,BudgetType,BudgetIdNo,AssetCategory," 
        + "Description,Purpose,CERAMount,[Proj ROI/ Payback (Yrs)],ProjectNPV,"
        + "TotalQuotedAmnt,ProjectName,ApproveDate,IsSupplemental,SupplementalNo,Created,Modified,ApprovedDate,AnnualBudget,CostCentre " 
        + "INTO XLSX('CERReport.xlsx',{headers:true}) FROM ? ",[data]);
    }

    const handleTableToExcel =() => {
        let uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
            , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
        
            let table:any = "cerTable";
            let name = "CER Report";

            if (!table.nodeType) table = document.getElementsByClassName(table)

            if(table && table.length > 0)
            {
                var ctx = {worksheet: name || 'Worksheet', table: table[0].innerHTML}
                window.location.href = uri + base64(format(template, ctx))
            }
    }

    const getBudgetType = (assetclass,budget,amount)=> {
      if(!budget)
      {
        const IT_ASSETCLASS = ['4000-Computer Hardware',
      '4000-Computer Hardware: Others','4000-Dell PC/Laptop PreApproved Models',
    '4000-Printers, Barcode, Copiers','4500-Computer Software','4500-Computer Sofware']

        if(IT_ASSETCLASS.indexOf(assetclass) >= 0)
        {
          return "IT";
        }
        else
        {
          if(parseFloat(amount) > 25000 ) return "Type B"
          return "Type A"
        }
      }
      else if(budget == "--Select--" || budget == "null"){
        if(parseFloat(amount) > 25000 ) return "Type B"
        return "Type A"
      }
      else
      {
        return budget == "--Select--" || budget == "null" ? "" : budget;
      }
    }

    const  getFinancialYear = (date)=> {
      var fiscalyear = "";
      var mydate = new Date(date);
      if ((mydate.getMonth() + 1) < 7) {
      //   fiscalyear = (today.getFullYear() - 1) + "-" + today.getFullYear()
        return "FY" + mydate.getFullYear()
      } else {
      //   fiscalyear = today.getFullYear() + "-" + (today.getFullYear() + 1)
        return "FY" + (mydate.getFullYear() + 1)
      }
      // return fiscalyear
    }

    const filterDropdownValue = (value)=> {
      if(value){
        return value == "--Select--" ? "" : value;
      }
      return ""
    }
    
    const onSubmit = async ()=> {
       try {
          setLoading(true);

          const allPlants = await PlantMaster.GetPlants()
          const deptCostCentres = await SiteCollectionApi.GetDeptCostCenter();
          const mapCCMaster = await SiteCollectionApi.GetMapCCMaster();

          const result = await CerAPI.CERReport(new Date(date[0]),new Date(date[1]));
          const annualBudget = await CerAPI.GetAnnualBudget();

          const getFYears = _.uniq(result.map((i)=>{
            return i.FYEAR
          }));

          const getMapCCMaster = (deptCostCentre)=> {
            const costcentre = mapCCMaster.map(x=> {
              return {
                ...x,
                DeptCost:`${x.CC_x0020_name} - ${x.SAP_x0020_CC_x0020_Code}`
              }
            }).find(y=>y.DeptCost == deptCostCentre);

            return costcentre ? costcentre.SAP_x0020_CC_x0020_Code : ""
          }

          const getPlant = (_cc)=>{
            const cc = _cc.substr(0,4)
            const plant =  allPlants.find(x=>x.Code == cc);
            if(plant) return plant.Title
            return ""
          }

          // const allCERFYears = await Promise.all(
          //   getFYears.map(async i=>{
          //     const fyearQuery = await CerAPI.CERReportForFyear(i);
          //     return fyearQuery.map(x=>{
          //       const cc = deptCostCentres.find(dc=>dc.Id == x.CER_DeptCostCentreId);
          //       const costcentre = cc ? cc.Cost_x0020_Centre : getMapCCMaster(x.DeptCostCentre);
          //       const plantTitle = getPlant(costcentre);
          //       return {
          //         ...x,
          //         CostCentre:cc,
          //         Plant:plantTitle
          //       }
          //     });
          //   })
          // )

          const _results = result.filter(x=>{
            const _created = moment(x.Created);
            const _differenceMonth = moment().diff(_created,'months',true);
              if(_differenceMonth > 6)
              {
                return x.CER_ItemStatus == "APPROVED";
              }
              return true;  
              // return _differenceMonth > 6 && x.CER_ItemStatus.toUpperCase() != "APPROVED";
          }).map(cer=>{
              const cerItems:any[] = cer.CER_TblAssetDtlsMD ? JSON.parse(cer.CER_TblAssetDtlsMD) : [];

              

              // const getRunningTotal = (fyear,plant)=> {
              //   allCERFYears.filter(x=>x.CER_ItemStatus == "APPROVED" &&
              //   x)
              // }

              const returnItems = cerItems.map((item)=>{
                  const {CER_RefNo,CER_PlantId,CER_DeptCostCentreId,Created,
                    CER_ItemStatus,FYEAR,DeptCostCentre,
                      ProjectNPV,ProjectROI,CER_Supplemental_Ref,IsSupplemental,
                      BudgetType,CER_NameofProject,CER_PurposeofReq,
                      ApprovedDate,Modified,
                  } = cer;

                  const CER_AssetDtlsTotalCalAmnt2 = cerItems.reduce((prev,curr)=>{
                    return prev += parseAmount(curr.TotalQuotedAmnt2)
                  },0);

                  const _mplant = getPlantTitle(CER_PlantId);

                  const _companycode = getPlantCompanyCode(CER_PlantId);
                  const _code = getPlantCode(CER_PlantId);


                  const cc = deptCostCentres.find(x=>x.Id == CER_DeptCostCentreId);

                  const _annualBudget = annualBudget.find(x=>x.Title == _mplant);

                  const _myAnnualbudget = _annualBudget &&  _annualBudget.ApprovedBudget ? _annualBudget.ApprovedBudget : 0;

                  const _budgetType = getBudgetType(item.SelAssetCat,item.BudgetType,CER_AssetDtlsTotalCalAmnt2);
                  
                  return {
                      CER:CER_RefNo,
                      Plant:_mplant,
                      CompanyCode:_companycode,
                      PlantCode:_code,
                      Status:CER_ItemStatus,
                      'CREATED FYEAR':FYEAR,
                      'APPROVED FYEAR':ApprovedDate ? getFinancialYear(ApprovedDate) : "",
                      // 'MODIFIED FYEAR':Modified ? getFinancialYear(Modified) : "",
                      ProjectName:CER_NameofProject,
                      Purpose:CER_PurposeofReq,
                      ApproveDate:CER_ItemStatus == 'APPROVED' ? (ApprovedDate ? moment(ApprovedDate).utc().format("DD-MM-YYYY")
                      : "") : "",
                      // : moment(Modified).utc().format("DD-MM-YYYY")) : "",
                      CERAMount:CER_AssetDtlsTotalCalAmnt2,
                      Created:moment(Created).utc().format("DD-MM-YYYY"),
                      Modified:moment(Modified).utc().format("DD-MM-YYYY"),
                      ApprovedDate:moment(ApprovedDate).utc().format("DD-MM-YYYY"),
                      AssetCategory:filterDropdownValue(item.SelAssetCat),
                      TotalQuotedAmnt:item.TotalQuotedAmnt2,
                      ProjectNPV:ProjectNPV || "",
                      ProjectROI:ProjectROI || "",
                      SupplementalNo:CER_Supplemental_Ref || "",
                      IsSupplemental:IsSupplemental  ? "Yes":"No",
                      BudgetIdNo:item.BudgetIndex || "",
                      'Proj ROI/ Payback (Yrs)':ProjectROI || "",
                      ...item,
                      BudgetType:_budgetType,
                      AnnualBudget:_myAnnualbudget,
                      CostCentre:cc ? cc.Cost_x0020_Centre : getMapCCMaster(DeptCostCentre)
                  }

              })
              return returnItems;
          });

          
          const allItems = _.flatten(_results);
          setData(allItems);
          setLoading(false)
          console.log('allItems',allItems);
       
       } catch (error) {
            console.log('error',error);
            setLoading(false)
       }

    }

    let excelTable = data.length >  1 ?  <ExcelTable cerData={data} /> : null;

    let exportBtn = data.length > 0 ? <button type="button" className="btn btn-success"
     onClick={handleALAExcelExport}>Export</button> : null;

    return <Layout>
    <Header>
        <h4 className={style.header}>CER Report</h4>
    </Header>
    <Content>
      {loading && <div className={style.spincontainer}>
        <Spin size="large"  />
        </div>}
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      >
          <Form.Item
            label="Date Range">
            <RangePicker value={date} 
                onChange={onChange} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        {exportBtn}
        <Button type="primary" htmlType="button"
        onClick={onSubmit}>
          Submit
        </Button>
      </Form.Item>
    </Form>

    {excelTable}

    </Content>
    <Footer></Footer>
  </Layout>
    
    
   
}

const ExcelTable = ({cerData}) => {
    return (
      <table className="cerTable table table-bordered">
        <thead>
          <tr>
          {columns.map((col,idx)=>{
            return <th key={idx}>
              {col.text}
            </th>
          })}
          </tr>
        </thead>
        <tbody>
        {cerData.map((item,idx) => {
          return <tr key={idx}>
            {
              columns.map((i,idx)=>{
                return <td>{item[columns[idx].dataField]}</td>
              })
            }
            
            {/* <td>{item[columns[1].dataField]}</td>
            <td>{item[columns[2].dataField]}</td>
            <td>{item[columns[3].dataField]}</td>
            <td>{item[columns[4].dataField]}</td>
            <td>{item[columns[5].dataField]}</td>
            <td>{item[columns[6].dataField]}</td>
            <td>{item[columns[7].dataField]}</td>
            <td>{item[columns[8].dataField]}</td>
            <td>{item[columns[9].dataField]}</td>
            <td>{item[columns[10].dataField]}</td>
            <td>{item[columns[11].dataField]}</td>
            <td>{item[columns[12].dataField]}</td> */}
          </tr>
        })}
        </tbody>
      </table>
    )
  }


function priceFormat(num:number){
    return num.toFixed(2);
  }

  function dateFormat(dt:string) {
    return new Date(dt).toLocaleDateString();
  }

  function priceFormatCell(cell,row){
    return priceFormat(cell);
  }

  function dateFormatCell(cell,row){
    return dateFormat(cell);
  }

  function toolTipFormatCell(cell,row){
    if(cell) return `<div title="${cell}">${cell}</div>`;
    return <div></div>
  }
