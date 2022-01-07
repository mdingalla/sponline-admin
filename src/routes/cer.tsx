import * as React from "react";
import { Route } from "react-router";
import { CERReportPagePath } from "../constants/config";
import { withRouter } from "react-router";
import Dashboard from "../containers/CERReport";

const AppRoutes = () => (
  <div className="container-fluid">
    <Route exact path={CERReportPagePath} component={withRouter(Dashboard)} />
    <Route exact path={`${CERReportPagePath}/budget`} component={withRouter(Dashboard)} />
    <Route exact path={`${CERReportPagePath}/approvaldatefix`} component={withRouter(Dashboard)} />
  </div>
);

export default AppRoutes;
