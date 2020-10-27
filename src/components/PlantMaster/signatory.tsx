import * as React from "react";
import { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import { Tabs, Tab } from "react-bootstrap";
import SPClientPeoplePicker from './../SPPeoplePicker';

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import {  UserAccessApi } from "../../sharepointapi/iconnectApi";
import { RouteComponentProps } from "react-router";
// import { IPersonaProps } from "office-ui-fabric-react/lib-es2015/Persona";
import Utility from "../../util";
import PlantMaster from "../../sharepointapi/plantMasterApi";
import { IPersonaProps } from "office-ui-fabric-react/lib/Persona";
import { isArray } from "@pnp/common";


function IsPeople(ppl){
    return ppl && ppl.results && ppl.results.length > 0
}



function ConvertPeople(ppl){
    return isArray(ppl) ? ppl : [ppl]
}

export namespace PlantSignatoryPage {
    export interface Props extends RouteComponentProps<void> {

    }

    export interface State {
        id:number;
        source:any;
        regionalfinance:IPersonaProps[],
        financecontroller:IPersonaProps[],
        hrpayroll:IPersonaProps[],
        hrcostcentersitemgr:IPersonaProps[],
        hrit:IPersonaProps[],
        sap:IPersonaProps[],
        cognos:IPersonaProps[],
        key:any;
    }
}

class PlantSignatoryPage extends React.Component<PlantSignatoryPage.Props,PlantSignatoryPage.State>{
    isCancelled: boolean;
    constructor(props){
        super(props);

        this.state = {
            id:null,
            key:'0',
            source:{
                Description:'',
                Title:'',
                CompanyCode:'',
                Code:''
            },
            regionalfinance:[],
            financecontroller:[],
            hrcostcentersitemgr:[],
            hrit:[],
            hrpayroll:[],
            sap:[],
            cognos:[]
        }

        this.refresh = this.refresh.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSave = this.handleSave.bind(this);
       
    }

    handleSelect(key){
        this.setState({
            key:key
        })
    }

    handleSave(){
        switch (this.state.key) {
            case "0":
                if(this.state.id){
                    
                    PlantMaster.AddOrUpdate({
                        FinanceControllerId:{
                            results:this.state.financecontroller.map(x=>{
                                return x.id
                            })
                        },
                        RegionalFinanceId:{
                            results:this.state.regionalfinance.map(x=>{
                                return x.id
                            })
                        },
                        HRITMGRId:this.state.hrit.length > 0 ? this.state.hrit[0].id : null,
                        HRITMGRPAYROLLId:this.state.hrpayroll.length > 0 ? this.state.hrpayroll[0].id : null
                    },this.state.id)
                        .then(()=>{
                            Utility.SimpleSwal("Saved...","Settings saved")
                        })
                }
                break;
        
            default:
                break;
        }
    }

    async refresh(){
        const id = this.props.match.params["id"];
        if(id){
            PlantMaster.GetPlant(id)
                .then((plant)=>{
                    Promise.all(
                        [   
                           plant.RegionalFinanceId ? UserAccessApi.PeopleToPicker(plant.RegionalFinanceId) : Promise.resolve(null),
                            plant.FinanceControllerId ? UserAccessApi.PeopleToPicker(plant.FinanceControllerId) : Promise.resolve(null),
                            plant.HRITMGRPAYROLLId ? UserAccessApi.PeopleToPicker(plant.HRITMGRPAYROLLId) : Promise.resolve(null),
                            plant.HRITMGRId ? UserAccessApi.PeopleToPicker(plant.HRITMGRId) : Promise.resolve(null)
                        ]
                    ).then((results)=>{

                        const regionalfinance = ConvertPeople(results[0])
                        const financecontroller  =ConvertPeople(results[1])
                        const hrpayroll = ConvertPeople(results[2])
                        const hritmgr = ConvertPeople(results[3])



                        !this.isCancelled && this.setState({
                            id:id,
                            source:plant,
                            regionalfinance:regionalfinance,
                            financecontroller:financecontroller,
                            hrpayroll:hrpayroll,
                            hrit:hritmgr

                        })
                    })
                   
                })


            
        }
       
    }

    componentWillUnmount() {
        this.isCancelled = true;
    }

    componentDidMount(){
        this.refresh();
    }

    render(){
        const RegionalFinance = <React.Fragment>
            <div className="form-group">
                <label className="control-label col-md-4">
                    Regional Finance
                </label>
                <div className="col-md-8">
                <SPClientPeoplePicker
                isMulti={true}
                    value={this.state.regionalfinance}
                    isprofile={true}
                    onChange={(e)=>{this.setState({
                    regionalfinance:e
                    })}} />
                </div>
            </div>
        </React.Fragment>

        const FinanceController = <React.Fragment>
            <div className="form-group">
                <label className="control-label col-md-4">
                    Finance Controller
                </label>
                <div className="col-md-8">
                <SPClientPeoplePicker
                isMulti={true}
                    value={this.state.financecontroller}
                    isprofile={true}
                    onChange={(e)=>{this.setState({
                    financecontroller:e
                    })}} />
                </div>
            </div>
        </React.Fragment>
        const HRIT = <React.Fragment>
        <div className="form-group">
            <label className="control-label col-md-4">
                HR IT
            </label>
            <div className="col-md-8">
            <SPClientPeoplePicker
            isMulti={false}
                value={this.state.hrit}

                isprofile={true}
                onChange={(e)=>{this.setState({
                hrit:e
                })}} />
            </div>
        </div>
    </React.Fragment>

        const HRPayroll = <React.Fragment>
        <div className="form-group">
            <label className="control-label col-md-4">
                HR Payroll
            </label>
            <div className="col-md-8">
            <SPClientPeoplePicker
            isMulti={false}
                value={this.state.hrpayroll}
                isprofile={true}
                onChange={(e)=>{this.setState({
                hrpayroll:e
                })}} />
            </div>
        </div>
</React.Fragment>

        const costCenterTab =  <Tab eventKey="0" title="CostCenter">
                {RegionalFinance}
                {FinanceController}
                {HRIT}
                {HRPayroll}
        </Tab>

        const sampleTab =  <Tab eventKey="1" title="Sample">
        {FinanceController}
        </Tab>
        
        return <div className="form form-horizontal">
            <h4 className="page-header">Signatory</h4>

            <div className="form-group">
                <label className="label label-info label-lg">
                {`${this.state.source.Title} ${this.state.source.Code} ${this.state.source.Description}`}
                </label>
            </div>

            <Tabs  id="plantmasterTabs" activeKey={this.state.key}
                onSelect={this.handleSelect}>
               {costCenterTab}
               {/* {sampleTab} */}
            </Tabs>

            <div className="pull-right">
                    <button type="button" 
                    onClick={this.handleSave}
                    className="btn btn-primary">
                        Save
                    </button>

                    <button type="button" 
                    onClick={()=>{
                        window.location.href = _spPageContextInfo.webAbsoluteUrl
                    }}
                    className="btn btn-danger">
                        Close
                    </button>
            </div>

        </div>
    }
}

export default PlantSignatoryPage;