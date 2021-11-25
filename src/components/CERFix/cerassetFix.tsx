import * as React from 'react';
import * as XLSX from "xlsx";
import classNames from 'classnames';

var Dropzone = require('react-dropzone');
import * as style from './styles.css';
import StaffMasterApi from '../../sharepointapi/staffMasterApi';
import CerAPI from '../../sharepointapi/cerApi';
import CERReport from '../../containers/CERReport';
import * as _ from 'lodash';


interface CERAssets {
    CERNo:string;
    Items:any[];
    IsUpdated:boolean
}

export const UpdateCERAssetFix = ()=> {

    const [data,setData] = React.useState<CERAssets[]>([]);
    const [cerData,setCER] = React.useState([]);
    
    React.useEffect(()=>{
        getAllCER();
    },[])

    const getAllCER = async ()=> {
        const allCERs = await CerAPI.GetAllCER()
        setCER(allCERs);
    }


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

            const grp = _.groupBy(data,'CER Number')

            const arr = Object.keys(grp).map(key => ({ CERNo:key, Items: grp[key],IsUpdated:false }));

            console.log(arr);
            
            setData(arr);

            
          };
          if (rABS) reader.readAsBinaryString(file);
          else reader.readAsArrayBuffer(file);
      }


      const ProcessUpdate = async ()=> {
          try {
              // get all staff 
                data.filter(x=>!x.IsUpdated).slice(0,100).map(async (cerAsset)=>{
                    const cerNo = cerAsset.CERNo;
                    const findCER = cerData.find(x=>x['CER_RefNo'] == cerNo);

                    if(findCER)
                    {
                        //build the new asset category table
                        const assetTable = findCER['CER_TblAssetDtlsMD'];
                        const assetTableObj:any[] = assetTable ? JSON.parse(assetTable) : [];

                        console.log('old',cerNo,cerAsset.Items)

                       const payloadAsset =  assetTableObj.map((item)=>{
                            const cerAssetItemCatAmt = cerAsset.Items.find(x=>parseFloat(x['Quoted Amt']) == parseFloat(item.TotalQuotedAmnt2)
                                && (x['AssetCategory'] == item.SelAssetCat 
                                || x['AssetCategory'] == "" 
                                || x['NEW ASSET CATEGORY'] == item.SelAssetCat));

                            if(cerAssetItemCatAmt)
                            {
                                cerAsset.IsUpdated = true
                                return {
                                    ...item,
                                    SelAssetCat:cerAssetItemCatAmt['NEW ASSET CATEGORY'],
                                    OldAsset:item.SelAssetCat
                                }

                            }
                            else
                            {
                                // const cerAssetItemDesc = cerAsset.Items.find(x=>(x['AssetCategory'] == item.SelAssetCat || x['NEW ASSET CATEGORY'] == item.SelAssetCat));

                                // if(cerAssetItemCatAmt)
                                // {
                                //      cerAsset.IsUpdated = true
                                //     return {
                                //         ...item,
                                //         SelAssetCat:cerAssetItemDesc['NEW ASSET CATEGORY'],
                                //         OldAsset:item.SelAssetCat
                                //     }
                                // }
                            }

                            return item;

                        })

                        if(cerAsset.IsUpdated)
                        {
                            await CerAPI.UpdateCER(findCER.Id,{
                                CER_TblAssetDtlsMD:JSON.stringify(payloadAsset),
                                CERVersion:"2"
                            })
                        }

                        console.log(`new ${cerNo}`,payloadAsset);
                        
                    }

                })

                console.log('Updated',data.filter(x=>x.IsUpdated).length)
                console.log('Not Updated',data.filter(x=>!x.IsUpdated).length)

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


      const RevertHistory = async ()=> {
        
        const targetVersion = "3";
        const cer3 = await CerAPI.GetAllCERVersion(targetVersion);

        cer3.map(async cer=>{

            const versions = cer.Versions.results;
            //get previous version
            const prev = versions.find(x=>x.CERVersion != targetVersion);

            if(prev)
            {
                console.log(prev);
                await CerAPI.RevertCER(cer.Id,prev.VersionId);
                // await CerAPI.RevertCER(cer.Id,prev.VersionLabel);
            }

            

        })

        // CerAPI.RevertCER(null,null)

      }

    return <div>

        <h4>Update CER Asset Fix</h4>

        <div>{dropzone}</div>

        <div>
        {data.length > 0 &&  <button type="button" className="btn btn-primary"
        onClick={ProcessUpdate}>Process</button>}

            <button type="button" className="btn btn-primary"
        onClick={RevertHistory}>Revert History</button>
        </div>
    </div>
}