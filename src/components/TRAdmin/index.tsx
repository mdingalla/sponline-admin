import * as React from 'react';
import { PettyCashApi, TravelApi } from '../../sharepointapi/iconnectApi';

interface TravelAdminProps {

}

export const TravelAdmin:React.FunctionComponent<TravelAdminProps> = ()=> {

    
    const [tritems,setTRItems] = React.useState("");
    const [tr,setTR] = React.useState(null);
    const [trId,setTRId] = React.useState(null);
    const [trdetails,setTRDetails] = React.useState([]);
    const [findtrdetails,setFindTRDetails] = React.useState<any[]>([]);

    const handleSearch = async ()=> {
        if(trId)
        {
            const travelRequest = await TravelApi.GetTravelId(trId);

            const findTRDetails = await TravelApi.FindTravelDetails(`TR1000${trId}`)

            setFindTRDetails(findTRDetails);

            setTR(travelRequest);

            // if(findTRDetails && findTRDetails.length > 0)
            // {
            //     setMessage(`TR Details already exist`);
            // }
            // else
            // {
            //     setMessage(`TR Not Found`)
            // }

            console.log(travelRequest);
            if(travelRequest.TRDetails)
            {
                try {
                    const trdetails:any[] = JSON.parse(travelRequest.TRDetails);

                    console.log(trdetails);

                    
                    if(trdetails.length > 0)
                    {
                      const _trdetails =  trdetails.map((item)=>{
                            const deptcostcentre:string = travelRequest.TROnBehalfDepartment || travelRequest.TRDepartment;

                            const _deptcc = deptcostcentre ? deptcostcentre.split("/") : ["",""];

                            const requestedBy:string = travelRequest.TRSubmittedBy || travelRequest.TRSubmittedBy || "/";

                            const _requstedby = requestedBy.split("/") || [];

                            const _requestedname = _requstedby.length > 1 ? _requstedby[1].trim() : "";

                            return {
                                Title: `TR1000${travelRequest.Id}`,
                                DateFrom: new Date(item.FromDate).toISOString(),
                                DateTo: new Date(item.ToDate).toISOString(),
                                Destination: item.Destination,
                                Country: item.Country,
                                Purpose:item.Purpose,
                                NoOfDays: item.NoOfDays,
                                Allowance: item.Allowance,
                                // FlightTicket: item.FlightTicket,
                                // FlightCost: item.FlightCost,
                                // InvoiceNo: item.InvoiceNo,
                                // DocHeaderText: item.DocHeaderText,
                                EmpNo: travelRequest.TROnBehalfOfEmpCode || travelRequest.TREmpCode,
                                StaffName: travelRequest.TROnBehalfName || _requestedname,
                                Department: _deptcc[0].trim(),
                                CostCentre: _deptcc[1].trim(),
                                // SubmittedBy: item.SubmittedBy,
                                // Approver1: item.Approver1,
                                // Approver2: item.Approver2,
                                // ApprovedDate2: item.ApprovedDate2,
                                // GroupID:null,
                                Revised: '',
                                // Remarks: item.Remarks,
                                // AirLine: item.AirLine,
                                // AirFare: item.AirFare,
                                // AirportTax: item.AirportTax,
                                // AgentFee: item.AgentFee,
                                // AirFareQuoteTotal: item.AirFareQuoteTotal,
                                // Justification: item.Justification,
                                // TRinfo: item.TRinfo,
                                // TravelType: item.TravelType
                            }
                        });

                        setTRDetails(_trdetails);
                    }


                } catch (error) {
                    alert(error)
                }
            }

           
        }
    }

    const handleSetTRCode = async ()=> {
        if(trId && trId > 0)
        {
           try {
            await TravelApi.UpdateTravelRequest(trId,{
                TRCode:`TR1000${trId}`
            })
            alert('Done')
           } catch (error) {
               alert(error)
           }
        }
    }
    

    const handleUploadGLItems = async ()=> {
       try {
        if(trdetails && trdetails.length > 0)
        {
            const ptcglitems:any[] = trdetails;

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

                    // if(item.ApprovedDate1)
                    // {
                    //     payload["ApprovedDate1"] = new Date(item.ApprovedDate1).toISOString();
                    // }

                    // if(item.HR1approvedDate)
                    // {
                    //     payload["HR1approvedDate"]  = new Date(item.HR1approvedDate).toISOString();
                    // }

                    // if(item.RequestedDate)
                    // {
                    //     payload["RequestedDate"] = new Date(item.RequestedDate).toISOString()
                    // }

                   TravelApi.AddTRDetails(payload)
                }));


                alert('Done');
            }
        }
       } catch (error) {
           console.log(error);
       }
    }

   const trtable = trdetails.length > 0 ? <TRTable items={trdetails} /> : null;

const labelmsg = findtrdetails.length > 0 ? <label>Already Found {findtrdetails.length} tr details.</label> : <label></label>

const btnAddTRDetails = trdetails.length > 0 ? <button type='button' className="btn btn-success"
onClick={handleUploadGLItems.bind(this)}>Post Travel Details</button> : null;

const btnSetTRCode = trdetails.length > 0 ? <button type='button' className="btn btn-info"
onClick={handleSetTRCode.bind(this)}>Set TR Code</button> : null;

    return (
        <div>
           <input className="form-control" placeholder="Enter Travel ID" type="number" 
           onChange={(e)=>{setTRId(parseInt(e.currentTarget.value))}}/>
           <button type="button" className="btn btn-default"
           onClick={()=>{
            handleSearch();
           }}>
                Search
           </button>
           
          

           <div>
               {trtable}
           {/* <button type='button' onClick={handleUploadGLItems.bind(this)}>Post GL Report</button>
           <button type='button' onClick={()=>{setGLItems("")}}>Clear</button> */}
           </div>

        {labelmsg}{btnAddTRDetails}{btnSetTRCode}
        </div>
    )


   
}

interface TRTableProps {
    items:any[];
}
const TRTable:React.FunctionComponent<TRTableProps> = (props)=> {
    return (<table className="table table-bordered">
        <thead>
            <tr>
            <th>TR Code</th>
                <th>EmpNo</th>
                <th>StaffName</th>
                <th>Department</th>
                <th>CostCentre</th>
                <th>Date From</th>
                <th>Date To</th>
                <th>Destination</th>
                <th>Country</th>
                <th>Purpose</th>
                <th>No. of Days</th
                ><th>Allowance</th>
                </tr>
        </thead>
        <tbody>
            {props.items.map((i,idx)=>{
                return <tr key={idx}>
                    <td>{i.Title}</td>
                    <td>{i.EmpNo}</td>
            <td>{i.StaffName}</td>
            <td>{i.Department}</td>
            <td>{i.CostCentre}</td>
            <td>{i.DateFrom}</td>
            <td>{i.DateTo}</td>
            <td>{i.Destination}</td>
            <td>{i.Country}</td>
            <td>{i.Purpose}</td>
            <td>{i.NoOfDays}</td>
            <td>{i.Allowance}</td>
            </tr>;
            })}
        </tbody>
    </table>)
}

interface TreeProp {
    data:any;
}
const Tree:React.FunctionComponent<TreeProp> = ({data}) => ( 
    <ul>
      {data && data.map(item => (
        <li>
          {item.title}
          {item.childNodes && <Tree data={item.childNodes} />}
        </li>
      ))}
    </ul>
  );


