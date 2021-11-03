import { Spin } from 'antd';
import * as React from 'react';
import CerAPI from '../../sharepointapi/cerApi';
import * as style from './style.css';

export const CERApprovalDateFix = ()=> {

    const [loading,setLoading] = React.useState(false);


    const FixApproveDates = async ()=>{
        try {
            setLoading(true);
       const CERs = await  CerAPI.GetApprovedNoApprovedDate();

            CERs.map((cer=>{
                const {Versions,Id} = cer;
                if(Versions && Id)
                {
                    const versions:any[] = Versions.results;
                    const ApprovedVersion = versions.filter(ver=>ver.CER_x005f_ItemStatus == 'APPROVED');
                   
                   if(ApprovedVersion.length > 0)
                   {
                       const LastIdx = ApprovedVersion.length - 1;
                       const ApprovedDate =  ApprovedVersion[LastIdx].Modified;
                        CerAPI.UpdateCER(Id,{
                           ApprovedDate:ApprovedDate
                       })
                   }

                }
            }))
            console.log("Done...")
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error)
        }

    }

    const ClearApproveDates = async ()=> {
        try {
            setLoading(true);
            const CERs = await CerAPI.GetApprovedCERs();
            
            CERs.map((cer=>{
                const {Id} = cer;

                CerAPI.UpdateCER(Id,{
                    ApprovedDate:null
                });
            }))
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    return <div>
         {loading && <div className={style.spincontainer}>
        <Spin size="large"  />
        </div>}
        <h4>CER Approval Date Fix</h4>

        <button type="button" onClick={FixApproveDates}>Fix</button>

        <button type="button" onClick={ClearApproveDates}>Clear</button>


    </div>
}

