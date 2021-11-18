import * as React from 'react';
import * as XLSX from "xlsx";
import classNames from 'classnames';

var Dropzone = require('react-dropzone');
import * as style from './styles.css';
import StaffMasterApi from '../../sharepointapi/staffMasterApi';



export const UpdateIHILStaffMaster = ()=> {

    const [data,setData] = React.useState([]);
    


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

            console.log(data);
            
            setData(data.map(x=>{
                return {
                    ...x,
                    IsUpdated:false
                }
            }));

            
          };
          if (rABS) reader.readAsBinaryString(file);
          else reader.readAsArrayBuffer(file);
      }


      const ProcessUpdate = async ()=> {
          try {
              // get all staff 
          var clone = [];
         
          await Promise.all(["IHIL","HITL"].map(async x=>{
            const _staff = await StaffMasterApi.GetAllStaffByPlant(x);
            clone.push(..._staff)
          }))
          
          data.filter(x=>!x.IsUpdated).map((staff)=>{
            const findStaff = clone.filter(x=>x.Cost_x0020_Centre == staff['Old cost centre']
            && x.EmpNo == staff['Old EmpCode'] || 
            (staff['E-mail'] && x.WindowsID && x.WindowsID.EMail && x.WindowsID.EMail == staff['E-mail']) ||
            (staff['E-mail'] && x.WorkEmail == staff['E-mail'])
            );

            const arrName = staff.EmployeeName_1.split(' ');
            const lastName = arrName[arrName.length -1];

            const firstName = staff.EmployeeName_1.replace(lastName,"").trim();

            const newCC = staff['NEW CostCenter'];

            const payload = {
                Plant:staff.Company,
                PlantCode:newCC.substr(0,4),
                Department:staff.DeptName,
                Position:staff.DesignationTitle,
                Cost_x0020_Centre:newCC,
                EmpNo:staff['NEW  EmpCode'],
                Known_x0020_As:staff.EmployeeName,
                Title:staff.EmployeeName_1,
                name1:firstName,
                name2:lastName,
                ContactNumber:'NA',
                Job_x0020_Level:staff.JobGrade
                
            };

            console.log(payload)

            if(findStaff){
                if(findStaff.length == 1)
                {
                    const staffmaster = findStaff[0];
                    //exactly one
                    // console.log('Found',staffmaster)
                    
                     StaffMasterApi.CreateOrUpdate(payload,staffmaster.Id)
                    staff.IsUpdated = true;
                }
                else
                {
                    if(findStaff.length > 1)
                    {
                        console.log(staff['Old cost centre'],findStaff,staff)
                    }
                    else
                    {
                        // console.log(staff['Old cost centre'],findStaff.length,staff)
                        StaffMasterApi.CreateOrUpdate(payload)
                        staff.IsUpdated = true;
                    }
                    

                    
                }
            }

          })
          const not_updated = data.filter(x=>!x.IsUpdated);
          console.log('NoMatch',not_updated)

          } catch (error) {

              console.log('ProcessUpdate',error)
          }

      }

      const dropzone = <div className={classNames(style.filedropzone,"dropzone")} >
        <Dropzone
        className={classNames(style.filedrop)}
         onDrop={onDrop.bind(this)}>
            <button type="button" className="btn btn-primary">Upload Template</button>
            </Dropzone></div>

    return <div>

        <h4>Update IHIL / HITL Staff Master</h4>

        <div>{dropzone}</div>

        <div>
        <button type="button" className="btn btn-primary"
        onClick={ProcessUpdate}>Process</button>
        </div>
    </div>
}