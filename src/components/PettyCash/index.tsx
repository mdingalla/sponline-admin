import * as React from 'react';
import { PettyCashApi } from '../../sharepointapi/iconnectApi';

interface IPTCGLProps {

}

export const PettyCashPTCGLItemImport:React.FunctionComponent<IPTCGLProps> = ()=> {

    const [ptcno,setPTCNo] = React.useState("");
    const [glitems,setGLItems] = React.useState("");

    const handleGetPTC = async ()=> {
        if(ptcno)
        {
           const data = await PettyCashApi.GetGLReportByPTCNo(ptcno);
           console.log(data);
        }
    }

    const handleUploadGLItems = async ()=> {
       try {
        if(glitems)
        {
            const ptcglitems:any[] = JSON.parse(glitems);

            if(ptcglitems.length > 0)
            {
               await Promise.all(ptcglitems.map((item)=>{
                    PettyCashApi.AddGLReport(item);
                }));

                alert('Done');
            }
        }
       } catch (error) {
           console.log(error);
       }
    }


    return (
        <div>
           <textarea className="form-control" value={glitems} onChange={(e)=>setGLItems(e.currentTarget.value)} />

           <div>
           <button type='button' onClick={handleUploadGLItems.bind(this)}>Post GL Report</button>
           </div>
        </div>
    )


    // return (
    //     <div>
    //         <input  type='text' value={ptcno} 
    //         onChange={(e)=>{setPTCNo(e.currentTarget.value)}} />
    //         <button type='button' onClick={handleGetPTC.bind(this)}>Get</button>
    //     </div>
    // )
}


