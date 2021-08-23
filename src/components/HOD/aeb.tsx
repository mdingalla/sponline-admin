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

export namespace AEBHoDImport {
  export interface Props {
    onImport:(data:CERMatrix[])=>void;
  }
}

export const AEBHoDImport:React.FC<AEBHoDImport.Props> = (props)=> {

    const [data,setData] = React.useState([]);
    const [costCentres,setCC] = React.useState([]);
    const [ccOwner,setCCOwner] = React.useState([]);
    const [employees,setEmployees] = React.useState([]);
    const [entity,setEntity] = React.useState(null);
    const [plant,setPlant] = React.useState('AEB');


    React.useEffect(()=>{
     
      
    },[])

    const refresh = async ()=> {
    
      refreshCC();
      refreshEmployee();
    }

    const refreshCC = async ()=> {
      const cc = await CostCenterMapApi.QueryAll()
      setCC(cc);
    }

    const refreshEmployee = async ()=> {
        const filter = `Plant eq 'AEB' or Plant eq 'AEB-AT`;
      const emp = await StaffMasterApi.GetStaffFilter(filter)
      setEmployees(emp.map(x=>{
        return {
          ...x,
          ManagerEmail:x.ManagerId ? x.Manager.EMail : null,
          ManagerUserName:x.ManagerId ? x.Manager.Name : null,
          UserEmail:x.WindowsIDId ? x.WindowsID.EMail : null,
          UserName:x.WindowsIDId ? x.WindowsID.Name : null,
          UserTitle:x.WindowsIDId ? x.WindowsID.Title : null,
          MyName:`${x.name2} ${x.name1}`
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
            const EmpNo = employee['EmployeeCode'];
            const EmployeeName = employee['Name'];
            const EmailAddress = employee['Email Address']
  
           
            // const _cc = costCentres.find(y=>y.SAP_x0020_CC_x0020_Code 
            //   == employee.CostCentre) 
            
            const findEmployee = employees.find(y=> y.Title && y.UserTitle 
                &&  (y.EmpNo == employee.EmpNo 
                || y.Title.toLowerCase() == EmployeeName.toLowerCase() 
                || y.UserTitle.toLowerCase() == EmployeeName.toLowerCase()
                || y.UserEmail == EmailAddress))

            const hod = findEmployee !== undefined ? findEmployee :null;

            if(hod)
            {
                const email = hod ? (findEmployee.WindowsID && findEmployee.WindowsID.EMail ?
                    findEmployee.WindowsID.EMail : (findEmployee.WorkEmail || "")) : null;
      
                  const cc = costCentres.find(x=>x.SAP_x0020_CC_x0020_Code == findEmployee.Cost_x0020_Centre);
                  
                  const costcentre= cc !== undefined ? `${cc.CC_x0020_name} - ${cc.SAP_x0020_CC_x0020_Code}` : 
                    `X ${findEmployee.Department} - ${findEmployee.Cost_x0020_Centre}`;
      
                  return {
                    Email:email,
                    CostCentre:costcentre,
                    EmployeeName:EmployeeName,
                    EmpNo:EmpNo
                  };
            }
            else
            {
                return {
                    Email:EmailAddress,
                    CostCentre:`XX - ${employee['Department']} - ${employee['Cost Center']}`,
                    EmployeeName:EmployeeName,
                    EmpNo:EmpNo
                  };
            }
  
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
