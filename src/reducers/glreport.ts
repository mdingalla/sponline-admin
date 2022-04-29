import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';
import { GLReportItems } from '../../types/models';

const initialState: GLReportItems = {
    glaccounts:[],
  data:[],
  querying:false
}

export default handleActions<GLReportItems, any>({
    [Actions.GET_GL_REPORT]: (state, action) => {
   
     return {
         ...state,
        ...action.payload
     }

    }

},initialState);