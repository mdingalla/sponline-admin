import { combineReducers, Reducer } from "redux";
import todos from "./todos";
import profile from "./profile";

import { routerReducer, RouterState } from "react-router-redux";
// import costcentre from "./costcentre";
import { TodoStoreState, AppProfile, CostCenterRequestPage } from "../../types/models";

export { RootState, RouterState };

interface RootState {
  todos: TodoStoreState;
  profile: AppProfile;
  router: RouterState;
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
  router: routerReducer
});
