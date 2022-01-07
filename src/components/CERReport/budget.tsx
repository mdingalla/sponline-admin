import * as React from 'react';
import { Form,DatePicker,Layout, Button, Spin} from "antd";
import * as XLSX from 'xlsx';

import * as style from './style.css';
import PlantMaster from '../../sharepointapi/plantMasterApi';
import FinanceHelper from '../../util/FInanceUtil';
import CerAPI from '../../sharepointapi/cerApi';
import moment = require("moment");
import * as _ from 'lodash';


let alasql = require('alasql');
alasql.utils.isBrowserify = false;
alasql.utils.global.XLSX = XLSX;

const { Header, Footer, Sider, Content } = Layout;

const columns = [
    {
      dataField: 'Site',
      text: 'Site Name'
    },
    {
        dataField: 'SiteNo',
        text: 'Site Number'
    },
    {
        dataField: 'TypeA',
        text: 'Type A Budget'
    },
    {
        dataField: 'RemainingA',
        text: 'Type A Remaining Budget'
    },
]


const CERBudget = ()=> {

    const [data,setData] = React.useState<any[]>([]);
    const [loading,setLoading] = React.useState(false);

    React.useEffect(()=>{
        Refresh();
    },[]);    

    const handleALAExcelExport =() => {
        alasql("SELECT Site,SiteNo,TypeA,RemainingA " 
        + "INTO XLSX('CERTypeABudget.xlsx',{headers:true}) FROM ? ",[data]);
    }

    const Refresh = async ()=> {
        setLoading(true)
        try {
            
            const fyear = FinanceHelper.GetFinancialYear();

            //get All plants
            const plants = await PlantMaster.GetPlants();

            //get All Annual
            const annualBudget = await CerAPI.GetAnnualBudgetByFyear(fyear);

            //get all CER
            const cers:any[] = await CerAPI.CERReportForFyear(fyear);

            const allCERs = _.flatten(cers.filter(z=>z.CER_ItemStatus == "APPROVED").map((cer)=>{
                
                const {Title,CER_PlantId,CER_AssetDtlsTotalCalAmnt2} = cer;
                var _items:any[] = cer.CER_TblAssetDtlsMD ? JSON.parse(cer.CER_TblAssetDtlsMD) : [];
            return  _items.map((cerItem)=>{

                    const {BudgetType,SelAssetCat,TotalQuotedAmnt2} = cerItem;

                    const _budgetType = FinanceHelper.GetBudgetType(BudgetType,SelAssetCat,CER_AssetDtlsTotalCalAmnt2)

                    return {
                        CER:Title,
                        PlantId:CER_PlantId,
                        BudgetType:_budgetType,
                        Amount:FinanceHelper.ParseAmount(TotalQuotedAmnt2)
                    }
                })

            }));
            

            const _data = plants.map((_plant)=>{

                const {Id,Title,Code} = _plant;

                const findBudget = annualBudget.find(z=>z.Title == Title && z.BudgetType == 'Type A');

                const typeABudget = findBudget ? FinanceHelper.ParseAmount(findBudget.ApprovedBudget) : 0;

                const cerTypeA = allCERs.filter(x=>x.BudgetType == "Type A" &&  x.PlantId == Id);

                const sumTypeA = cerTypeA.reduce((prev,curr)=>{
                    return prev += curr.Amount
                },0);

                const remaining = typeABudget - sumTypeA;

                return {
                    Site:Title,
                    SiteNo:Code,
                    TypeA:typeABudget.toFixed(2),
                    RunningTypeA:sumTypeA,
                    RemainingA:remaining.toFixed(2)
                }
            })

            setData(_.orderBy(_data,'SiteNo'));
            setLoading(false);
            
        } catch (error) {
            setLoading(false)
        }
    
    }

    let excelTable = data.length >  1 ?  <ExcelTable cerData={data} /> : null;

    let exportBtn = data.length > 0 ? <button type="button" className="btn btn-success"
     onClick={handleALAExcelExport}>Export</button> : null;

    return <Layout>
            <Header>
                <h4 className={style.header}>CER Annual and Remaining Budget</h4>
            </Header>
            <Content>
                {loading && <div className={style.spincontainer}>
                    <Spin size="large"  />
                </div>}

                <div>
                {exportBtn}
                </div>

                <div>
                {excelTable}
                </div>

                <div>
                {exportBtn}
                </div>
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
          </tr>
        })}
        </tbody>
      </table>
    )
  }


export default CERBudget;