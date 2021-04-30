import * as React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;

import paginationFactory from "react-bootstrap-table2-paginator";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

import { BootstrapTableOptions, AdminPagePath, GroupsPath } from "../../constants/config";
import SiteCollectionApi from "../../sharepointapi/siteCollection";

const columns = ()=>  [
    {
        dataField:'Title',
        text:'Group Name',
        formatter:(cellContent,row) => {
            return (<div>
                <a target="_blank"
                 href={`${AdminPagePath}/group/${row.Id}`}>
                     {row.Title}
                 </a>
                {/* <button type="button" 
                onClick={()=>{ref.handleNavigateSignatory(row.Id)}}
                className="btn btn-primary">Signatories</button> */}
            </div>)
        }
    },
    {
        dataField:'OwnerTitle',
        text:'Owner'
    },
    {
        dataField:'ccp',
        text:'Action',
        isDummyField: true,
        formatter:(cellContent,row) => {
            return (<div>
                <a className="btn btn-primary" 
                target="_blank" href={`${_spPageContextInfo.siteAbsoluteUrl}/_layouts/15/people.aspx?MembershipGroupId=${row.Id}`}>Open</a>
                {/* <button type="button" 
                onClick={()=>{ref.handleNavigateSignatory(row.Id)}}
                className="btn btn-primary">Signatories</button> */}
            </div>)
        }
    },
]

export namespace GroupsPage {
    export interface Props {

    }

    export interface State {
        userid:number;
        source:any[];
    }
}

class GroupsPage extends React.Component<GroupsPage.Props,GroupsPage.State>{
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
        SiteCollectionApi.GetAllGroups()
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
            <h4>SharePoint Groups</h4>
            <ToolkitProvider
                keyField='Id' data={this.state.source} columns={columns()} 
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

export default GroupsPage;