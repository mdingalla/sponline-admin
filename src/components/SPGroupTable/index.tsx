import * as React from 'react';
import { PettyCashApi } from '../../sharepointapi/iconnectApi';
import StaffMasterApi from '../../sharepointapi/staffMasterApi';
import SiteCollectionApi from '../../sharepointapi/siteCollection';
import { RouteComponentProps } from 'react-router';


export namespace SPGroupTable {
    export interface Props extends RouteComponentProps<void> {

    }

    export interface State {
        searchtext:string;
        message:string;
        items:SPUser[];
    }

    export interface SPUser {
        Title:string;
        Position:string;
        UserId:number;
        Plant:string;
        Department:string;
    }
}

const hrefStyle = {
    display:'none'
}

class SPGroupTable extends React.Component<SPGroupTable.Props,SPGroupTable.State>{
    constructor(props){
        super(props);

        this.updatePosition = this.updatePosition.bind(this)
        this.tableToExcel = this.tableToExcel.bind(this)

        this.state ={
            message:'',
            searchtext:'',
            items:[]
        }

     
    }

    componentDidMount(){
        let id = this.props.match.params["id"];

        SiteCollectionApi.GetGroupById(id)
            .then((group)=>{
                if(group){
                    this.setState({
                        message:group.Title
                    });
                    SiteCollectionApi.GetUsersInGroup(group.Title)
                        .then((users:any[])=>{
                            // console.log(users)

                            let newUsers =  users.map((i)=>{
                                let user = {
                                    UserId:i.Id,
                                    Title:i.Title
                                } as SPGroupTable.SPUser
                                 return this.updatePosition(user);
                            })

                            Promise.all(newUsers)
                            .then((result)=>{
                                this.setState({
                                    items:result
                                })
                            })

                          
                        })
                }
            })
    }

    updatePosition(user:SPGroupTable.SPUser) {

         return StaffMasterApi.getStaffMasterByWindowsId(user.UserId)
        .then((staff)=>{
           if(staff && staff.length > 0)
           {
               user.Position = staff[0].Position;
               user.Department = staff[0].Department;
               user.Plant = staff[0].Plant;
               
           }
           return user;
        })

    }

    tableToExcel(table, name, filename){
        var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
       
            if (!table.nodeType) table = document.getElementById(table)
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
            document.getElementById("dlink").setAttribute('href',uri + base64(format(template, ctx)));
            document.getElementById("dlink").setAttribute('download',filename);
            // document.getElementById("dlink").href = uri + base64(format(template, ctx));
            // document.getElementById("dlink").download = filename;
            document.getElementById("dlink").click();

        
    }

    
    render(){

        return <div className="row">
                <h4>{this.state.message}</h4>
                <div>
                <div>
                <a id="dlink" style={hrefStyle}></a>
<input type="button" onClick={()=>{this.tableToExcel('tblGroup', 'name', 'myfile.xls')}} value="Export to Excel" />
                </div>
                    <table id='tblGroup' className="table table-condensed">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Plant</th>
                                <th>Position</th>
                                <th>Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.items.map((i,idx)=>{
                                return <tr key={idx}>
                                <td>{i.Title}</td>
                                <td>{i.Plant}</td>
                                <td>{i.Position}</td>
                                <td>{i.Department}</td>
                            </tr>
                            })}
                        </tbody>
                    </table>
                </div>
        </div>
    }

}

export default SPGroupTable;