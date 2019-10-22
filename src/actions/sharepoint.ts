import { createAction } from 'redux-actions';
import * as Actions from '../constants/actions';
import StaffMasterApi from '../sharepointapi/staffMasterApi';
import { RootState } from '../reducers';
import { StaffMasterADData } from '../../types/models';
import { PagedItemCollection } from '@pnp/sp';


// import { create } from 'domain';

let myheaders = new Headers();
myheaders.append('Content-Type','application/json;odata=verbose');
myheaders.append('Accept','application/json;odata=verbose');


export const getSharePointData = createAction<StaffMasterADData[]>(Actions.GET_SHAREPOINT_DATA);
export const getSharePointRestResult = createAction<StaffMasterADData>(Actions.GET_REST_SHAREPOINT_DATA);
export const getFreshSharePointData = createAction<StaffMasterADData[]>(Actions.GET_FRESH_SHAREPOINT_DATA);



export function getAllStaffDomain(plant?:string){
    return function(dispatch){
     dispatch(executeSPPagedData(StaffMasterApi.getUserWithLoginForSync(plant)))    
        
    }
}

function executeSPPagedData(sppromise: Promise<PagedItemCollection<StaffMasterADData[]>>){
    return function(dispatch){
        sppromise.then((result)=>{
            dispatch(getPageSharePointData(result))
        })    
    }
}

export function syncLDAP(StaffDetails:any){
   return function(dispatch){
    let userlogin = StaffDetails.WindowsID.Name;

    let ldapsync = {
        aDInfo:{
          plant:StaffDetails.Plant,
          companyName:'',
          department:StaffDetails.Department,
          position:StaffDetails.Position,
          officePhone:StaffDetails.ContactNumber,
          employeeId:StaffDetails.EmpNo,
          costcenter: StaffDetails.Cost_x0020_Centre,
          mobilePhone:StaffDetails.CellPhone
        },
        targetDN:userlogin.replace('i:0#.w|interplex\\',''),
        loginName:'',
        password:''
      };

    let myheaders = new Headers();
    myheaders.append('Content-Type',"application/json;charset=utf-8");
    myheaders.append('Accept',"application/json, text/plain, */*");
    myheaders.append('dataType',"json");
    myheaders.append('Access-Control-Allow-Origin',"*")
    

      
      fetch('http://192.168.65.88/api/ldap/',{
    //   fetch('http://localhost:5000/api/ldap/',{
          method:'POST',
          body:JSON.stringify(ldapsync),
          headers:myheaders
      }).then((result)=>{
          result.json().then((data)=>{
             if(data.result.result)
             {
                StaffMasterApi.UpdateSyncStatus(StaffDetails.Id,true)
                .then(()=>{
                    dispatch(getSharePointRestResult({
                        Id:StaffDetails.Id,
                        Status:"Sync Success"
                    }))
                })
              
             }
             else{
                StaffMasterApi.UpdateSyncStatus(StaffDetails.Id,false)
                .then(()=>{
                    dispatch(getSharePointRestResult({
                        Id:StaffDetails.Id,
                        Status:"Sync Failed"
                    }))
                })
             }
          }).catch(()=>{
            StaffMasterApi.UpdateSyncStatus(StaffDetails.Id,false)
            .then(()=>{
                dispatch(getSharePointRestResult({
                    Id:StaffDetails.Id,
                    Status:"Sync Failed"
                }))
            })
            
          })
      }).catch(()=>{
        StaffMasterApi.UpdateSyncStatus(StaffDetails.Id,false)
        .then(()=>{
            dispatch(getSharePointRestResult({
                Id:StaffDetails.Id,
                Status:"Sync Failed"
            }))
        })
      })
   }
}

export function syncAll(items:any[]){
    return function(dispatch,getState){
        let root = getState() as RootState;

        // root.adusers.results.forEach((item)=>{
        //     if(items.indexOf(item.Id)> -1)
        //     {
        //         dispatch(syncLDAP(item));
                
        //     }
        // })


    }
}

export function getPageSharePointData(spdata: PagedItemCollection<StaffMasterADData[]>){
    return function(dispatch){
        let transformdata = spdata.results.slice(0,100).map((item)=>{
            return {
                ...item,
                User:item.WindowsID.Name
            }
        })
            dispatch(getSharePointData(transformdata))
        if(spdata.hasNext){
         dispatch(executeSPPagedData(spdata.getNext()))
        }
    }
}

export function getNextSharePointData(nextUrl:string){
    return function(dispatch){
        fetch(nextUrl,{credentials: 'same-origin',headers:myheaders})
        .then((result)=>{
            return result.json().then(spdata=>{
                dispatch(getSharePointData(spdata))
            })
        })
    }
}


