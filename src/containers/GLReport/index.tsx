import * as React from 'react';
import * as SearchActions from '../../actions/glreport';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../reducers';

import travelWrapper from '../../components/TravelHOC';


import {GLReportView} from './../../components/PettyCash/glreportview';
import { GLReportItems } from '../../../types/models';


export namespace GLReport {
  export interface Props extends RouteComponentProps<void> {
    glreport:GLReportItems;
    searchactions: typeof SearchActions;
    // adusers:SharePointRestResult;
  }

  export interface State {
    /* empty */
  
  }
}

// @travelWrapper(mapStateToProps, mapDispatchToProps)
export class GLReport extends React.Component<GLReport.Props, GLReport.State> {

  private loader:any;

  constructor(props,context)
  {
    super(props);

    
    
  }

  componentDidMount(){
  }

  componentWillReceiveProps(nextProps: GLReport.Props){
    
    if(nextProps != this.props)
    {
      SP.SOD.executeFunc('sp.js', 'SP.ClientContext', ()=>this.proccessLoader(nextProps));


    }
  }

  proccessLoader(nextProps: GLReport.Props){
    
  }

  render() {
    const {   glreport } = this.props;

    return (
      <div className="col-md-12">
        <div className="row-fluid">
          <div className="col-lg-12">
          <GLReportView {...this.props} />
          </div>
        </div>


        <div className="row-fluid">
          <div className="col-lg-12">
              
          </div>
        </div>
      </div>

    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    glreport: state.glreport
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // sharepointactions: bindActionCreators(SharePointActions as any, dispatch)
    searchactions: bindActionCreators(SearchActions as any, dispatch)
  };
}



export default connect(mapStateToProps,mapDispatchToProps)(travelWrapper(GLReport));