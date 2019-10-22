import * as React from 'react';
import * as SharePointActions from '../../actions/sharepoint';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../reducers';

import travelWrapper from '../../components/TravelHOC';


import SPGroupTable from '../../components/SPGroupTable';
import { SharePointRestResult } from '../../../types/models';


export namespace GroupContainer {
  export interface Props extends RouteComponentProps<void> {
    sharepointactions: typeof SharePointActions;
    // actions: typeof TodoActions;
    adusers:SharePointRestResult;
  }

  export interface State {
    /* empty */
  
  }
}

// @travelWrapper(mapStateToProps, mapDispatchToProps)
export class GroupContainer extends React.Component<GroupContainer.Props, GroupContainer.State> {
  constructor(props)
  {
    super(props);


    
  }





  
  render() {
    return (
      <div className="col-md-12">
        <div className="row-fluid">
          <div className="col-lg-12">
                <SPGroupTable {...this.props} />
          </div>
        </div>

      </div>

    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    todos: state.todos,
    // adusers:state.adusers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sharepointactions: bindActionCreators(SharePointActions as any, dispatch)
  };
}



export default connect(mapStateToProps,mapDispatchToProps)(travelWrapper(GroupContainer));