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


export const StaffImport = ()=> {

    const [data,setData] = React.useState([]);
    const [costCentres,setCC] = React.useState([]);
    const [ccOwner,setCCOwner] = React.useState([]);
    const [employees,setEmployees] = React.useState([]);
    const [entity,setEntity] = React.useState(null);
    const [plant,setPlant] = React.useState('IEPB');


    React.useEffect(()=>{
     
      
    },[])

    const refresh = async ()=> {
      if(!plant) return;
      const _plant = await PlantMaster.GetPlantsByTitle(plant);
      if(_plant && _plant.length > 0) setEntity(_plant[0]);
      refreshCC(plant);
      refreshEmployee(plant);
      refreshCCOwners();
    }

    const refreshCC = async (plant)=> {
      const cc = await CostCenterMapApi.QueryAll()
      setCC(cc);
    }

    const refreshCCOwners = async ()=> {
      const cc = await CostCenterOwnerApi.GetAll()
      setCCOwner(cc.map(x=>{
        return {
          ...x,
          MgrName:x.ManagerUserID && x.ManagerUserID.Title ? x.ManagerUserID.Title : ""
        }
      }));
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
              setData(data.filter(x=>x.Plant == plant));
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
            const FirstName = employee['First Name'];
  
            const arrName = FirstName.split(' ');

            let staff = {};

            const lastName = arrName[arrName.length -1];
            const firstName = FirstName.replace(lastName,"").trim();

            const _plant = entity
            const _cc = costCentres.find(y=>y.SAP_x0020_CC_x0020_Code == employee.CostCentre)

            const user = employee.EmailAddress ?
             await UserApi.ensureUser(employee.EmailAddress) : null;

            const manager = ccOwner.find(y=>y.Title == employee.ApprovingManager
              || y.MgrName == employee.ApprovingManager)
            
             
             const findEmployee = employees.find(y=>y.Plant == plant && (y.EmpNo == employee.EmpNo 
              || y.Title == FirstName))

              const ID = findEmployee !== undefined ? findEmployee.Id :null;

              staff = {
                 Title:FirstName,
                 name1:firstName,
                 name2:lastName,
                 EmpNo:employee.EmpNo,
                 PlantCode:_plant ? _plant.Code : null,
                 Plant:employee.Plant,
                 Cost_x0020_Centre:employee.CostCentre,
                 Department:_cc ? _cc.CC_x0020_name : "",
                 Position:employee.Position,
                 ContactNumber:employee.ContactNo || "NA",
                 WorkEmail:employee.EmailAddress,
                 WindowsIDId:user ? user.d.Id : null,
                 ManagerId:manager !== undefined ?  manager.ManagerUserIDId : null
               };

               await StaffMasterApi.CreateOrUpdate(staff,ID);

            return staff;
  
          }))
  
          console.log(result);
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
        <h4>StaffImport</h4>
        <div>
          <input type="text" value={plant} onChange={(e)=>{setPlant(e.currentTarget.value)}} />
        </div>
        <div>{dropzone}</div>
        <div><button type="button" onClick={handleImport}
        className="btn btn-primary">Import</button></div>
    </div>
}
