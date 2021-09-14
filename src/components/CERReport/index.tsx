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
    dataField: 'FYear',
    text: 'FYear'
  }, 
  {
  dataField: 'Title',
  text: 'Title'
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
  dataField: 'Created',
  text: 'Created'
}
];


const data = [['attribute', 'attribute2'], ['value1', 'value2']];


const { RangePicker } = DatePicker;
const { Header, Footer, Sider, Content } = Layout;

import '!style-loader!css-loader!antd/dist/antd.css';
import CerAPI from '../../sharepointapi/cerApi';
import PlantMaster from '../../sharepointapi/plantMasterApi';
import * as _ from 'lodash';
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

    const handleALAExcelExport =() => {
        alasql("SELECT Plant,FYear,Title,Status,BudgetType,AssetCategory," 
        + "Description,Purpose,CERAMount,TotalQuotedAmnt,ProjectName,ApproveDate,Created " 
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

    const getBudgetType = (budget,amount)=> {
      if(!budget)
      {
        if(parseFloat(amount) > 25000 ) return "Type B"
        return "Type A"
      }
      else
      return budget;
    }
    
    const onSubmit = async ()=> {
       try {
        setLoading(true)
        const result = await CerAPI.CERReport(new Date(date[0]),new Date(date[1]));
        const _results = result.map(cer=>{
            const cerItems = cer.CER_TblAssetDtlsMD ? JSON.parse(cer.CER_TblAssetDtlsMD) : [];

            const returnItems = cerItems.map((item)=>{
                const {CER_RefNo,CER_PlantId,Created,
                  CER_ItemStatus,FYEAR,
                    BudgetType,CER_NameofProject,CER_PurposeofReq,
                    ApproveDate,Modified,CER_AssetDtlsTotalCalAmnt1
                } = cer;
                return {
                    Title:CER_RefNo,
                    Plant:getPlantTitle(CER_PlantId),
                    Status:CER_ItemStatus,
                    FYear:FYEAR,
                    BudgetType:getBudgetType(BudgetType,CER_AssetDtlsTotalCalAmnt1),
                    ProjectName:CER_NameofProject,
                    Purpose:CER_PurposeofReq,
                    ApproveDate:ApproveDate ? moment(ApproveDate).format("DD-MM-YYYY")
                     : moment(Modified).format("DD-MM-YYYY"),
                     CERAMount:CER_AssetDtlsTotalCalAmnt1,
                     Created:moment(Created).format("DD-MM-YYYY"),
                     AssetCategory:item.SelAssetCat,
                     TotalQuotedAmnt:item.TotalQuotedAmnt1,
                    ...item
                }

            })

            return returnItems;
        });
        
        setData(_.flatten(_results));
        setLoading(false)
        // console.log(_.flatten(_results));
       
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
            <td>{item[columns[0].dataField]}</td>
            <td>{item[columns[1].dataField]}</td>
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
            <td>{item[columns[12].dataField]}</td>
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
