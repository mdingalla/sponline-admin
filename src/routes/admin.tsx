import * as React from "react";
import { Route } from "react-router";
import { AdminPagePath, SignatoryAdminPagePath } from "../constants/config";
import { withRouter } from "react-router";
import Playground from "../containers/Playground";
import PlantMasterContainer from "../containers/PlantMaster";


const AppRoutes = () => (
  <div className="container-fluid">
    <Route exact path={AdminPagePath} component={withRouter(PlantMasterContainer)} />
    <Route exact path={`${SignatoryAdminPagePath}`} component={withRouter(PlantMasterContainer)} />
    <Route path={AdminPagePath + "/test"} component={withRouter(Playground)} />
    <Route path={AdminPagePath + "/test/:id"} component={withRouter(Playground)} />
  </div>
);

export default AppRoutes;
