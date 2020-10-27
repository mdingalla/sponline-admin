import * as React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
const { SearchBar, ClearSearchButton } = Search;
const { ExportCSVButton } = CSVExport;
import TravelApi from "../../sharepointapi/travelApi";
import CostCenterMapApi from "../../sharepointapi/costCenterMapApi";
import { map } from "bluebird";
import SupplierApi from "../../sharepointapi/supplierApi";
import LegalWebApi from "../../sharepointapi/LegalWebApi";

import paginationFactory from "react-bootstrap-table2-paginator";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

import { BootstrapTableOptions, SignatoryAdminPagePath, AdminPagePath } from "../../constants/config";
import PlantMaster from "../../sharepointapi/plantMasterApi";

const columns = (props:PlantMasterPage.Props,state:PlantMasterPage.State,ref:PlantMasterPage)=>  [
    {
        dataField:'CompanyCode',
        text:'Company'
    },
    {
        dataField:'Code',
        text:'PlantCode'
    },
    {
        dataField:'Title',
        text:'Short'
    },
    {
        dataField:'Description',
        text:'Name'
    },
    {
        dataField:'ccp',
        text:'Action',
        isDummyField: true,
        formatter:(cellContent,row) => {
            return (<div>
                <a className="btn btn-primary" 
                target="_blank" href={ `${AdminPagePath}/signatory/${row.Id}`}>Signatories</a>
                {/* <button type="button" 
                onClick={()=>{ref.handleNavigateSignatory(row.Id)}}
                className="btn btn-primary">Signatories</button> */}
            </div>)
        }
    },
]

export namespace PlantMasterPage {
    export interface Props {

    }

    export interface State {
        userid:number;
        source:any[];
    }
}

class PlantMasterPage extends React.Component<PlantMasterPage.Props,PlantMasterPage.State>{
    isCancelled: boolean;
    constructor(props){
        super(props);

        this.state = {
            userid:_spPageContextInfo.userId,
            source:[]
        }

        this.refresh = this.refresh.bind(this);
        this.handleProcess = this.handleProcess.bind(this);
        this.handleNavigateSignatory = this.handleNavigateSignatory.bind(this);

    }

    async refresh(){
        PlantMaster.GetPlants()
            .then((plants)=>{
              !this.isCancelled &&  this.setState({
                    source:plants
                })
            })
    }

    handleNavigateSignatory(id){
        window.location.href = `${AdminPagePath}/signatory/${id}`
    }

    handleProcess(){
        
        
        
    }

    componentWillUnmount() {
        this.isCancelled = true;
    }

    componentDidMount(){
        this.refresh();
    }

    render(){

        
        return <div>
            <h4>Plant Master</h4>
            <ToolkitProvider
                keyField='Id' data={this.state.source} columns={columns(this.props,this.state,this)} 
                striped hover condensed
                search>
                    {
                        props => (
                            <div>
                                <SearchBar { ...props.searchProps } />
                                {/* <ClearSearchButton { ...props.searchProps } /> */}
                                <hr />
                                <BootstrapTable 
                                 pagination={ paginationFactory(BootstrapTableOptions) }
                                { ...props.baseProps }
                               
                                />
                                <ExportCSVButton { ...props.csvProps }>CSV Export</ExportCSVButton>
                                <button type="button" 
                                    onClick={()=>{
                                        window.location.href = _spPageContextInfo.webAbsoluteUrl
                                    }}
                                    className="btn btn-danger">
                                        Close
                                    </button>
                            </div>
                        )
                    }
                </ToolkitProvider>
           
        </div>
    }
}

export default PlantMasterPage;