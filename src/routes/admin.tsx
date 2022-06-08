import * as React from "react";
import { Route } from "react-router";
import { AdminPagePath, GroupsPagePath, GroupsPath, pagePath, SignatoryAdminPagePath, StaffImportPagePath, SupplierMasterSyncPath, SupplierMasterSyncPath2, SupplierUpdateAdminPagePath, TRAdmin, TRImportPagePath, UpdateSupplierFromXML } from "../constants/config";
import { withRouter } from "react-router";
import Playground from "../containers/Playground";
import PlantMasterContainer from "../containers/PlantMaster";
import Dashboard from "../containers/Dashboard";
import GroupContainer from "../containers/Groups";
import GLReport from "../containers/GLReport";

const AppRoutes = () => (
  <div className="container-fluid">
    <Route exact path={AdminPagePath} component={withRouter(Dashboard)} />
    <Route  path={TRImportPagePath} component={withRouter(Dashboard)} />
    <Route  path={SupplierMasterSyncPath} component={withRouter(Dashboard)} />
    <Route  path={SupplierMasterSyncPath2} component={withRouter(Dashboard)} />
    <Route  path={TRAdmin} component={withRouter(Dashboard)} />
    <Route  path={GroupsPagePath} component={withRouter(Dashboard)} />
    <Route  path={StaffImportPagePath} component={withRouter(Dashboard)} />
    <Route  path={GroupsPath + "/:id"} component={withRouter(GroupContainer)} />
    <Route exact path={`${SignatoryAdminPagePath}`} component={withRouter(PlantMasterContainer)} />
    <Route path={SupplierUpdateAdminPagePath} component={withRouter(Dashboard)} />
    <Route path={UpdateSupplierFromXML} component={withRouter(Dashboard)} />
    
    <Route path={AdminPagePath + "/test"} component={withRouter(Playground)} />
    <Route path={AdminPagePath + "/test/:id"} component={withRouter(Playground)} />
    <Route path={AdminPagePath + "/glreport"} component={withRouter(GLReport)} />
  </div>
);

export default AppRoutes;
