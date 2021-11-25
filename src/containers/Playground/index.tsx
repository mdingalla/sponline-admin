import * as React from "react";
import * as SharePointActions from "../../actions/sharepoint";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { RootState } from "../../reducers";

import travelWrapper from "../../components/TravelHOC";
import {HoDImport} from "../../components/HOD";

import { SharePointRestResult } from "../../../types/models";
import { UpdateCERAssetFix } from "../../components/CERFix/cerassetFix";
// import UploadSupplierOnline from "../../components/SPOnline/uploadSupplier";

export namespace Playground {
  export interface Props extends RouteComponentProps<void> {
    sharepointactions: typeof SharePointActions;
    // actions: typeof TodoActions;
    adusers: SharePointRestResult;
  }

  export interface State {
    /* empty */
    value:any;
  }
}

// @travelWrapper(mapStateToProps, mapDispatchToProps)
export class Playground extends React.Component<
  Playground.Props,
  Playground.State
> {
  constructor(props) {
    super(props);

    this.state = {
      value:new Date()
    }
  }

  render() {

    const plant = this.props.match.params["id"];

    return (
      <div className="col-md-12">
        <div className="row-fluid">
          <div className="col-lg-12">
            {/* <UpdateCERAssetFix /> */}
            {/* <HoDImport plant={plant} /> */}
            {/* <SupplierMasterVendorCode /> */}
            {/* <PTCGLItemFix /> */}
            {/* <UploadSupplierOnline /> */}
            {/* <TravelAttendanceSync /> */}
            {/* <CostCentreHeadCount /> */}
            {/* <TravelTaskUrlUpdate />
            <PettyCashTaskUrlUpdate/> */}
            {/* <APIUpdate /> */}
            {/* <TRClaimCheck /> */}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    todos: state.todos,
    // adusers: state.adusers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sharepointactions: bindActionCreators(SharePointActions as any, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(travelWrapper(Playground));
