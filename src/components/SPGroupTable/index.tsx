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

class SPGroupTable extends React.Component<SPGroupTable.Props,SPGroupTable.State>{
    constructor(props){
        super(props);

        this.updatePosition = this.updatePosition.bind(this)

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

    
    render(){

        return <div className="row">
                <h4>{this.state.message}</h4>
                <div>
                    <table className="table table-condensed">
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