import * as React from 'react';

export namespace ExportTable {
    export interface Props {
        data:CERMatrix[];
    }
}

export const ExportTable:React.FC<ExportTable.Props> = (props)=> {

    return (
        <div>
            <table className="table">
                <thead>
                   <tr>
                   <th>Title</th>
                    <th>AssetCategory</th>
                    <th>Level</th>
                    <th>Approver</th>
                    <th>Role</th>
                    <th>DeptCostCentre</th>
                   </tr>
                </thead>
                <tbody>
                    {props.data.map((i,idx)=>{
                      return  <tr key={idx}>
                        <td>{i.Title}</td>
                        <td>{i.AssetCategory}</td>
                        <td>{i.Level}</td>
                        <td>{i.Approver}</td>
                        <td>{i.Role}</td>
                        <td>{i.DeptCostCentre}</td>
                    </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export interface CERMatrix {
    Title:string;
    AssetCategory?:string;
    Level:number;
    Approver:string;
    Role:string;
    DeptCostCentre?:string;

}