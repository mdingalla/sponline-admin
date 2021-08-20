import classNames from 'classnames';
import * as React from 'react';
import * as XLSX from "xlsx";
import CostCenterMapApi from '../../sharepointapi/costCenterMapApi';
import CostCenterOwnerApi from '../../sharepointapi/costCenterOwnerApi';
import PlantMaster from '../../sharepointapi/plantMasterApi';
import StaffMasterApi from '../../sharepointapi/staffMasterApi';
import {oneLine} from 'common-tags';
var Dropzone = require('react-dropzone')

import * as style from './styles.css';
import { CERMatrix } from './table';

export namespace EUHoDimport {
  export interface Props {
    onImport:(data:CERMatrix[])=>void;
  }
}

export const EUHoDimport:React.FC<EUHoDimport.Props> = (props)=> {

    const [data,setData] = React.useState([]);
    const [costCentres,setCC] = React.useState([]);
    const [ccOwner,setCCOwner] = React.useState([]);
    const [employees,setEmployees] = React.useState([]);
    const [entity,setEntity] = React.useState(null);
    const [plants,setPlants] = React.useState([]);
    // const [plant,setPlant] = React.useState('IMX');


    React.useEffect(()=>{
     
    },[])

    const refresh = async ()=> {
     // if(!plant) return;
    //  const _plant = await PlantMaster.GetPlantsByTitle(plant);
    //  if(_plant && _plant.length > 0) setEntity(_plant[0]);
        refreshPlants();
        refreshCC();
        refreshEmployee();
    }

    const refreshPlants = async ()=> {
        const _plants = await PlantMaster.GetPlants();
        setPlants(_plants);
    }

    const refreshCC = async ()=> {
      const cc = await CostCenterMapApi.QueryAll();
      setCC(cc);
    }

    const refreshEmployee = async ()=> {
        const filter = oneLine`Plant eq 'ISOPREC' or 
                     Plant eq 'PMP' or 
                     Plant eq 'IHUN' or 
                     Plant eq 'ING'  or 
                     Plant eq 'AICR' or 
                     Plant eq 'IPECR' or  
                     Plant eq 'IICR'`;
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
              setData(data.map(i=>{
                  return {
                      ...i,
                  }
              }));
              refresh();
            
          };
          if (rABS) reader.readAsBinaryString(file);
          else reader.readAsArrayBuffer(file);
      }

      const handleImport = async ()=> {
        
        try {
          const result = await Promise.all(data.map(async employee=>{
            //find employee no + email + name
            const EmpNo = employee['EmpNo'];
            const EmployeeName:string = employee['EmployeeName'];

            const employee_name = EmployeeName.toLowerCase();

            const findEmployee = employees.find(y=>(y.Plant == employee.Plant)  
              && y.Title && y.UserTitle && (
                  y.EmpNo == EmpNo ||
                y.Title.toLowerCase() == employee_name ||
               y.UserTitle.toLowerCase() == employee_name ||
               y.MyName.toLowerCase() == employee_name))

            if(findEmployee !== undefined)
            {
                const hod = findEmployee !== undefined ? findEmployee :null;

                const email = hod ? (findEmployee.WindowsID && findEmployee.WindowsID.EMail ?
                  findEmployee.WindowsID.EMail : (findEmployee.WorkEmail || "")) : null;
    
                // const user = email ?
                //  await UserApi.ensureUser(email) : null;
    
                const _plant = findEmployee.Plant;


                const cc = costCentres.find(x=>x.SAP_x0020_CC_x0020_Code == findEmployee.Cost_x0020_Centre);
                
                const costcentre= cc !== undefined ? `${cc.CC_x0020_name} - ${cc.SAP_x0020_CC_x0020_Code}` : 
                `X ${findEmployee.Department} - ${findEmployee.Cost_x0020_Centre}`;

                    
                return {
                    Email:email,
                    Title: _plant,
                    CostCentre:costcentre,
                    EmployeeName:EmployeeName,
                    EmpNo:EmpNo
                    };
            }
            else
            {
                return {
                    Email:'',
                    Title:employee.Plant,
                    CostCentre:'XXX',
                    EmployeeName:`${EmpNo} - ${EmployeeName}`,
                    EmpNo:EmpNo
                }
            }

            
            
          
  
          }))
  
          console.log(result);

          props.onImport(result.map(x=>{
            return {
               Approver:x.Email || x.EmployeeName,
               Level:1,
               Role:'Dept Head',
               Title:x.Title,
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
        <div>{dropzone}</div>
        <div><button type="button" onClick={handleImport}
        className="btn btn-primary">Import</button></div>
    </div>
}
