import * as React from "react";
import * as SharePointActions from "../../actions/sharepoint";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { RootState } from "../../reducers";

import travelWrapper from "../../components/TravelHOC";

import { SignatoryAdminPagePath } from "../../constants/config";

import { SharePointRestResult } from "../../../types/models";
import PlantMasterPage from "../../components/PlantMaster";
import PlantSignatoryPage from "../../components/PlantMaster/signatory";

export namespace PlantMasterContainer {
  export interface Props extends RouteComponentProps<void> {
    sharepointactions: typeof SharePointActions;
    // actions: typeof TodoActions;
    adusers: SharePointRestResult;
  }

  export interface State {
    /* empty */
  }
}

// @travelWrapper(mapStateToProps, mapDispatchToProps)
export class PlantMasterContainer extends React.Component<
PlantMasterContainer.Props,
PlantMasterContainer.State
> {
  constructor(props) {
    super(props);
  }

  render() {

    let form =  <PlantMasterPage {...this.props} />

    switch (this.props.match.path) {
      case `${SignatoryAdminPagePath}`:
        form = <PlantSignatoryPage {...this.props} />
        break;
    
      default:

        break;
    }

    return (
      <div className="col-md-12">
        <div className="row-fluid">
          <div className="col-lg-12">
           {form}
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
)(travelWrapper(PlantMasterContainer));
