import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';
import { AppProfile, StaffMaster } from '../../types/models';

const initialState: AppProfile = {
    Staff:{
        id:0
    },
    User:{
        Title:_spPageContextInfo.userLoginName,
        Email:_spPageContextInfo.userEmail,
        Id:_spPageContextInfo.userId,
        LoginName:_spPageContextInfo.userLoginName,
        Groups:{
            results:[]
        }
    },
    IsAdmin:false
};

export default handleActions<AppProfile,StaffMaster>({
    [Actions.GET_PROFILE]: (state, action) => {
        return state;
    },
    [Actions.PROFILE_RECEIVED]: (state, action) => {
        return {
            ...state,
            ...action.payload
        }
    }
},initialState);