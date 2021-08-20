import classNames from 'classnames';
import * as React from 'react';
import * as XLSX from "xlsx";
import CostCenterMapApi from '../../sharepointapi/costCenterMapApi';
import CostCenterOwnerApi from '../../sharepointapi/costCenterOwnerApi';
import PlantMaster from '../../sharepointapi/plantMasterApi';
import StaffMasterApi from '../../sharepointapi/staffMasterApi';
import UserApi from '../../sharepointapi/userApi';
var Dropzone = require('react-dropzone')

import * as style from './styles.css';
import { CERMatrix } from './table';

export namespace IMXHoDImport {
  export interface Props {
    onImport:(data:CERMatrix[])=>void;
  }
}

export const IMXHoDImport:React.FC<IMXHoDImport.Props> = (props)=> {

    const [data,setData] = React.useState([]);
    const [costCentres,setCC] = React.useState([]);
    const [ccOwner,setCCOwner] = React.useState([]);
    const [employees,setEmployees] = React.useState([]);
    const [entity,setEntity] = React.useState(null);
    const [plant,setPlant] = React.useState('IMX');


    React.useEffect(()=>{
     
      
    },[])

    const refresh = async ()=> {
      if(!plant) return;
      const _plant = await PlantMaster.GetPlantsByTitle(plant);
      if(_plant && _plant.length > 0) setEntity(_plant[0]);
      refreshCC(plant);
      refreshEmployee(plant);
    }

    const refreshCC = async (plant)=> {
      const cc = await CostCenterMapApi.QueryAll()
      setCC(cc);
    }

    const refreshEmployee = async (plant)=> {
      const emp = await StaffMasterApi.GetStaffByPlantCode(plant)
      setEmployees(emp.map(x=>{
        return {
          ...x,
          ManagerEmail:x.ManagerId ? x.Manager.EMail : null,
          ManagerUserName:x.ManagerId ? x.Manager.Name : null,
          UserEmail:x.WindowsIDId ? x.WindowsID.EMail : null,
          UserName:x.WindowsIDId ? x.WindowsID.Name : null
        }
      }));
    }

    const onDrop = (files: File[]) => {
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        const file = files[0];
        
        reader.onload = e => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            console.log(rABS, wb);
            /* Convert array of arrays */
            const data:any[] = XLSX.utils.sheet_to_json(ws, {  });
            
            if(plant)
            {
              setData(data);
              refresh();
            } 
          };
          if (rABS) reader.readAsBinaryString(file);
          else reader.readAsArrayBuffer(file);
      }

      const handleImport = async ()=> {
        
        try {
          const result = await Promise.all(data.map(async employee=>{
            //find employee no + email + name
            const EmpNo = employee['EmpNo'];
            const EmployeeName = employee['EmployeeName'];
  
            const _plant = entity
            const _cc = costCentres.find(y=>y.SAP_x0020_CC_x0020_Code 
              == employee.CostCentre) 
            
            const findEmployee = employees.find(y=>y.Plant == plant 
              && (y.EmpNo == employee.EmpNo 
              || y.Title == EmployeeName))

            const hod = findEmployee !== undefined ? findEmployee :null;

            const email = hod ? (findEmployee.WindowsID && findEmployee.WindowsID.EMail ?
              findEmployee.WindowsID.EMail : (findEmployee.WorkEmail || "")) : null;

            const user = email ?
             await UserApi.ensureUser(email) : null;
            
          const costcentre = `${_cc !== undefined ? _cc.CC_x0020_name : employee.DEPARTMENT} - ${employee.CostCentre}`
            return {
              Email:email,

              CostCentre:costcentre,
              EmployeeName:EmployeeName,
              EmpNo:EmpNo
            };
  
          }))
  
          console.log(result);

          props.onImport(result.map(x=>{
            return {
               Approver:x.Email,
               Level:1,
               Role:'Dept Head',
               Title:plant,
               AssetCategory:'',
               DeptCostCentre:x.CostCentre
            }
          }));



        } catch (error) {
          console.log('error',error)
        }
      }

    
    const dropzone = <div className={classNames(style.filedropzone,"dropzone")} >
        <Dropzone
        className={classNames(style.filedrop)}
         onDrop={onDrop.bind(this)}>
            <button type="button" className="btn btn-primary">Upload Template</button>
            </Dropzone></div>
            
    return <div>
        <h4>HoD Import</h4>
        <div>
          <input type="text" value={plant} onChange={(e)=>{setPlant(e.currentTarget.value)}} />
        </div>
        <div>{dropzone}</div>
        <div><button type="button" onClick={handleImport}
        className="btn btn-primary">Import</button></div>
    </div>
}
