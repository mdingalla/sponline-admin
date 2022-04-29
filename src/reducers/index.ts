import { combineReducers, Reducer } from "redux";
import todos from "./todos";
import profile from "./profile";
import glreport from "./glreport";
import { routerReducer, RouterState } from "react-router-redux";
// import costcentre from "./costcentre";
import { TodoStoreState, AppProfile, CostCenterRequestPage, GLReportItems } from "../../types/models";

export { RootState, RouterState };

interface RootState {
  todos: TodoStoreState;
  profile: AppProfile;
  router: RouterState;
  glreport: GLReportItems;
  // costcenterrequest:CostCenterRequestPage;
}

// export default combineReducers<RootState> ({
//   todos,
//   profile,
//   vendor,
//   router
// });

export const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  todos: todos,
  profile: profile,
  router: routerReducer,
  glreport:glreport
});
