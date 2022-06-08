import * as React from 'react';
import { Prev } from 'react-bootstrap/lib/Pagination';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { SupplierApi } from '../../sharepointapi/iconnectApi';
import { debounce } from 'lodash';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const UpdateSupplierFromXMLPage:React.FunctionComponent = ()=> {

    
    const [supplierCode,SetCode] = React.useState<string>("");
    const [data,setData] = React.useState({});
    const [open, setOpen] = React.useState(false);
  

    React.useEffect(()=>{
        
    },[])


    const handleFix = async ()=> {
     try {
        if(supplierCode){
            const url = `https://192.168.65.88/api/supplier/startwith/${supplierCode}`;
            // const url = `http://192.168.65.88/api/supplier/${vendorcode}`;
            fetch(url)
            .then(response => response.json())
            .then(async r => {
                // setData([data.vendors])
                if(r && r.vendors && r.vendors.length > 0)
                {
                    var spsSupplier  = null;
                    const supplier = await SupplierApi.GetSupplierMasterByVendorCode(supplierCode);
                    if(supplier && supplier.length > 0)
                    {
                        spsSupplier = supplier[0];
                    }

                    const i = r.vendors[0];

                    if(i)
                    {

                        const companies = JSON.stringify(i.companies ? i.companies.map((co)=>{
                            return {
                                code:co['@Code'],
                                name:co.name,
                                deleteBlock:co.deleteBlock,
                                payMethod:co.payMethod,
                                payTerm:co.payTerm,
                                postingBlock:co.postingBlock,
                                purchasingBlock:co.purchasingBlock
                            }
                        }) : []);

                        const purchaseOrg = JSON.stringify(i.purchaseOrg ? i.purchaseOrg.map((po)=>{
                            return {
                                name:po.Name,
                                code:po['@Code'],
                                currency:po.currency,
                                deleteBlock:po.deleteBlock,
                                postingBlock:po.postingBlock,
                                purchasingBlock:po.purchasingBlock
                            }
                        }) : []);

                        const bankData = JSON.stringify(i.bankData ? i.bankData : []);
                        const payload = {
                            Title:i.name,
                            VendorCode:i.code,
                            Street:i.street,
                            District:i.district,
                            WorkCity:i.city,
                            Country:i.country,
                            PostCode:i.postCode,
                            FaxNo:i.faxNo,
                            TelNo:i.telNo,
                            Email_692850a1_x002d_35e9_x002d_:i.email,
                            Tax:i.tax,
                            Companies:companies,
                            BankData:bankData,
                            PurchaseOrg:purchaseOrg,
                            PostingBlock:i.postingBlock,
                            PurchasingBlock:i.purchasingBlock,
                            DeleteBlock:i.deleteBlock,
                
                        }

                        // console.log(payload);
                        setData(payload);
                
                    const _data = await SupplierApi.AddUpdateSupplierMaster(payload,spsSupplier ? spsSupplier.Id : null);
                    console.log(_data);
                    setOpen(true);
                    }
                }
            });
        }
       
     } catch (error) {
         console.log(error);
     }
    }

    

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleTextChange = (e)=> {
    const newText = e.currentTarget.value
    SetCode(newText);
      if(!newText){
        setData({});
      }
  }

    return (
        <div>
            <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Supplier Updated"
      />
            <h4>Update Supplier Master from XML</h4>
            <div>
            <label>Supplier/VendorCode</label><input type='text' value={supplierCode} 
            onChange={(e)=>{handleTextChange(e)}} />
            </div>
            <div>
                {JSON.stringify(data)}
            </div>
            <div>
                <button className="btn-primary" type="button" onClick={handleFix}>Update Supplier Master</button>
            </div>
        </div>
    )
};