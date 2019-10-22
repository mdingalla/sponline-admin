import { createAction } from 'redux-actions';
import * as Actions from '../constants/actions';
// import { UserProfile } from 'sp-pnp-js/lib/pnp';
import StaffMasterApi from '../sharepointapi/staffMasterApi';
import { RootState } from '../reducers';
import { SPADMIN } from '../constants/filters';


function staffMasterSuccess(payload){
    return {
        type:Actions.PROFILE_RECEIVED,
        payload:payload
    }
}

export function getStaffMaster(id)
{
    return function(dispatch) {
        Promise.all([
          StaffMasterApi.getUser(id),
          // StaffMasterApi.getStaffMasterByWindowsId(id)
        ]).then(result => {
            const user = result[0];
          // const staff = result[1];
          
          const isAdmin = user.Groups.results.filter(x=>x.Title == SPADMIN).length > 0;
    
          dispatch(
            staffMasterSuccess({
              User: result[0],
              // Staff: staff && staff.length > 0 ? staff[0] : null,
              IsAdmin:isAdmin
            })
          );
        });
      };
}


export function getAppConfig(id) {
    return function(dispatch,getState:()=>RootState) {
      const {profile} = getState();
      const isAdmin = profile.User.Groups.results.filter(x=>x.Title == SPADMIN).length > 0;
      if (isAdmin) {
        dispatch(staffMasterSuccess({
            IsAdmin:isAdmin
        }))
      }
    };
}