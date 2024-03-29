import * as React from 'react';
import { SupplierApi } from '../../sharepointapi/iconnectApi';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const SupplierMasterVendorCode:React.FunctionComponent = ()=> {

    const [data,setData] = React.useState<any[]>([]);
    const [vendorcode,SetCode] = React.useState<string>("");
  

    React.useEffect(()=>{
        async function loadQuery(){

           
        }

        loadQuery();
    },[])

    const query = async ()=> {
        if(vendorcode){
            const url = `https://192.168.65.88/api/supplier/${vendorcode}`;
            // const url = `http://192.168.65.88/api/supplier/${vendorcode}`;
            fetch(url)
            .then(response => response.json())
            .then(data => setData([data]));
                    }
    }

    const handleClick = ()=> {
        query();
    }

    const handleFix = async (i)=> {
     try {
        const supplierCode = i.vendorCode;
        var spsSupplier  = null;
        const supplier = await SupplierApi.GetSupplierMasterByVendorCode(supplierCode);
        if(supplier && supplier.length > 0)
        {
             spsSupplier = supplier[0];
        }
 
        const payload = {
            Title:i.title,
            VendorCode:i.vendorCode,
            Street:i.street,
            District:i.district,
            WorkCity:i.city,
            Country:i.country,
            PostCode:i.postCode,
            FaxNo:i.faxNo,
            TelNo:i.telNo,
            Email_692850a1_x002d_35e9_x002d_:i.email,
            Tax:i.tax,
            Companies:i.companies,
            BankData:i.bankData,
            PurchaseOrg:i.purchaseOrg,
            PostingBlock:i.postingBlock,
            PurchasingBlock:i.purchasingBlock,
            DeleteBlock:i.deleteBlock,
 
        }
 
       const _data = await SupplierApi.AddUpdateSupplierMaster(payload,spsSupplier ? spsSupplier.Id : null);
       console.log(_data);
     } catch (error) {
         console.log(error);
     }
    }

    return (
        <div>
            <div>
            <label>VendorCode</label><input type='text' value={vendorcode} 
            onChange={(e)=>{SetCode(e.currentTarget.value)}} />
            </div>
            

            <table className="table">
                <thead>
                    <th>Code</th>
                    <th>Supplier</th>
                    <th></th>
                </thead>
                <tbody>
                    {data.map((i)=>{
                        return <tr>
                            <td>{i.vendorCode}</td>
                            <td>{i.title}</td>
                            <td>
                            <button className="btn-success" type="button"  onClick={
                                ()=>{
                                    handleFix(i);
                                }
                            }>Update</button>
                            </td>
                        </tr>
                    })}

                </tbody>
            </table>
            <div>
                <button className="btn-primary" type="button" onClick={handleClick}>Query</button>
                
            </div>
        </div>
    )
};