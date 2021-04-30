import * as React from 'react';
import { PettyCashApi } from '../../sharepointapi/iconnectApi';
import StaffMasterApi from '../../sharepointapi/staffMasterApi';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const StaffMasterFix:React.FunctionComponent = ()=> {

    const [data,setData] = React.useState<any[]>([]);
    const [plant,setPlant] = React.useState<string>("");
    const [plantCode,setPlantCode] = React.useState<string>("");

    React.useEffect(()=>{
        async function loadQuery(){

           
        }

        loadQuery();
    },[])

    const refresh = async ()=> {
        const EmptyPlantCodes = await StaffMasterApi.GetEmptyPlantCode(plant);
        setData(EmptyPlantCodes);
        if(data.length > 0) console.log(data[0].EmpNo);
    }

    const handleClick = ()=> {
        refresh();
    }

    const handleFix = async ()=> {
        if(plantCode && data.length > 0)
        {
            await Promise.all(data.map((i)=>{
                StaffMasterApi.UpdateStaffMaster(i.ID,{
                    PlantCode:plantCode
                })
            }));
            alert('Done');
        }
    }

    return (
        <div>
            <div>
            <label>Plant</label><input type='text' value={plant} 
            onChange={(e)=>{setPlant(e.currentTarget.value)}} />
            </div>
            <div>
            <label>PlantCode</label><input type='text' value={plantCode} 
            onChange={(e)=>{setPlantCode(e.currentTarget.value)}} />
            </div>
            <div>
                
                <button className="btn-primary" type="button" onClick={handleClick}>Query</button>
                <button className="btn-success" type="button"  onClick={handleFix}>Fix</button>
            </div>
        </div>
    )
};