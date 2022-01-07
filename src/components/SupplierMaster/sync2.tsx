import * as React from 'react';
import { SupplierApi } from '../../sharepointapi/iconnectApi';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const SupplierMasterVendorJSONCode:React.FunctionComponent = ()=> {

    
    const [vendorJSON,SetCode] = React.useState<string>("");
  

    React.useEffect(()=>{
        
    },[])


    const handleFix = async ()=> {
     try {

        const i = JSON.parse(vendorJSON);

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
            <label>Vendor JSON</label><input type='text' value={vendorJSON} 
            onChange={(e)=>{SetCode(e.currentTarget.value)}} />
            </div>
            
            <div>
                <button className="btn-primary" type="button" onClick={handleFix}>Update</button>
                
            </div>
        </div>
    )
};