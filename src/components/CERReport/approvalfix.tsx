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


    const ClearComputerSofware = async ()=> {
        try {
            

            const CERs = await CerAPI.GetCERVersion("2");

            CERs.map((cer)=>{

                const cerItems:any[] = cer.CER_TblAssetDtlsMD ? JSON.parse(cer.CER_TblAssetDtlsMD) : [];

                const hasWrong = cerItems.some(z=>z.SelAssetCat == "4500-Computer Sofware");

                if(hasWrong){
                    const cloneItems = cerItems.map(z=>{
                        if(z.SelAssetCat == "4500-Computer Sofware")
                        {
                            return {
                                ...z,
                                SelAssetCat:"4500-Computer Software"
                            }
                        }
                        else
                        {
                            return z
                        }
                    })
                    //update cer here:
                    console.log(cloneItems)
                    CerAPI.UpdateCER(cer.Id,{
                        CER_TblAssetDtlsMD:JSON.stringify(cloneItems)
                    });
                }

            })

        } catch (error) {
            
        }
    }

    return <div>
         {loading && <div className={style.spincontainer}>
        <Spin size="large"  />
        </div>}
        {/* <h4>CER Approval Date Fix</h4> */}

        {/* <button type="button" onClick={FixApproveDates}>Fix</button>

        <button type="button" onClick={ClearApproveDates}>Clear</button> */}

        <h4>Correct Asset Category</h4>

        <button type="button" onClick={ClearComputerSofware}>Correct</button>


    </div>
}

