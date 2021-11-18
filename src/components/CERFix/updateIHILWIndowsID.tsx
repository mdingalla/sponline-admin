import * as React from 'react';
import * as XLSX from "xlsx";
import classNames from 'classnames';

var Dropzone = require('react-dropzone');
import * as style from './styles.css';
import StaffMasterApi from '../../sharepointapi/staffMasterApi';
import UserApi from '../../sharepointapi/userApi';



export const UpdateIHILWindowsID = ()=> {

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
          
          data.filter(x=>!x.IsUpdated && x['E-mail']).map(async (staff)=>{
            const findStaff = clone.filter(x=>x.Cost_x0020_Centre == staff['Old cost centre']
            && x.EmpNo == staff['Old EmpCode'] || 
            (staff['E-mail'] && x.WindowsID && x.WindowsID.EMail && x.WindowsID.EMail == staff['E-mail']) ||
            (staff['E-mail'] && x.WorkEmail == staff['E-mail'])
            );

            const arrName = staff.EmployeeName_1.split(' ');
            const lastName = arrName[arrName.length -1];

            const firstName = staff.EmployeeName_1.replace(lastName,"").trim();

            const newCC = staff['NEW CostCenter'];

            

            if(findStaff){
                if(findStaff.length == 1)
                {
                    const staffmaster = findStaff[0];
                    const email = staff['E-mail']
                    const user =  await UserApi.ensureUser(email)
                    console.log(user)
                    if(user && user.d && user.d.Id)
                    {
                        StaffMasterApi.CreateOrUpdate({
                            WindowsIDId:user.d.Id
                        },staffmaster.Id)
                    }
                   
                    staff.IsUpdated = true;
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