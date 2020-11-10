import * as React from 'react';
import { PettyCashApi, TravelApi } from '../../sharepointapi/iconnectApi';

interface TravelDetailsProps {

}

export const TravelDetailsImport:React.FunctionComponent<TravelDetailsProps> = ()=> {

    const [ptcno,setPTCNo] = React.useState("");
    const [glitems,setGLItems] = React.useState("");

    

    const handleUploadGLItems = async ()=> {
       try {
        if(glitems)
        {
            const ptcglitems:any[] = JSON.parse(glitems);

            if(ptcglitems.length > 0)
            {
               await Promise.all(ptcglitems.map((item)=>{

                    const payload = {
                        Title: item.Title,
                        DateFrom: new Date(item.DateFrom).toISOString(),
                        DateTo: new Date(item.DateTo).toISOString(),
                        Destination: item.Destination,
                        Country: item.Country,
                        Purpose:item.Purpose,
                        NoOfDays: item.NoOfDays,
                        Allowance: item.Allowance,
                        FlightTicket: item.FlightTicket,
                        FlightCost: item.FlightCost,
                        InvoiceNo: item.InvoiceNo,
                        DocHeaderText: item.DocHeaderText,
                        EmpNo: item.EmpNo,
                        StaffName: item.StaffName,
                        Department: item.Department,
                        CostCentre: item.CostCentre,
                        SubmittedBy: item.SubmittedBy,
                        Approver1: item.Approver1,
                        Approver2: item.Approver2,
                        ApprovedDate2: item.ApprovedDate2,
                        GroupID:item.GroupID,
                        Revised: item.Revised,
                        Remarks: item.Remarks,
                        AirLine: item.AirLine,
                        AirFare: item.AirFare,
                        AirportTax: item.AirportTax,
                        AgentFee: item.AgentFee,
                        AirFareQuoteTotal: item.AirFareQuoteTotal,
                        Justification: item.Justification,
                        TRinfo: item.TRinfo,
                        TravelType: item.TravelType
                    }

                    if(item.ApprovedDate1)
                    {
                        payload["ApprovedDate1"] = new Date(item.ApprovedDate1).toISOString();
                    }

                    if(item.HR1approvedDate)
                    {
                        payload["HR1approvedDate"]  = new Date(item.HR1approvedDate).toISOString();
                    }

                    if(item.RequestedDate)
                    {
                        payload["RequestedDate"] = new Date(item.RequestedDate).toISOString()
                    }

              

                    console.log(payload);
                   TravelApi.AddTRDetails(payload)
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
           <button type='button' onClick={()=>{setGLItems("")}}>Clear</button>
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


