import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../reducers';

import travelWrapper from '../../components/TravelHOC';



// require('bootstrap-loader');
// import 'bootstrap/dist/css/bootstrap.css';
import '!style-loader!css-loader!./override.css';
import { TodoItemData } from '../../../types/models';
import { PettyCashPTCGLItemImport } from '../../components/PettyCash';
import { TRAdmin, TRImportPagePath } from '../../constants/config';
import { TravelDetailsImport } from '../../components/Travel/import';
import { TravelAdmin } from '../../components/TRAdmin';


export namespace Dashboard {
  export interface Props extends RouteComponentProps<void> {
    
  }

  export interface State {
    /* empty */
  }
}

// @travelWrapper(mapStateToProps, mapDispatchToProps)
export class Dashboard extends React.Component<Dashboard.Props, Dashboard.State> {
  constructor(props)
  {
    super(props);
  }

  
  
  render() {

    let form = null;

    switch (this.props.location.pathname) {

      case TRAdmin:
        form = <TravelAdmin />;
        break;

      case TRImportPagePath:
        form = <TravelDetailsImport />;
        break;
    
      default:
        form = <PettyCashPTCGLItemImport />;
        break;
    }

    return (
      <div className="row-fluid">
        {form}
    </div>

    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    todos: state.todos
  };
}

function mapDispatchToProps() {
  return {
    // actions: bindActionCreators(TodoActions as any, dispatch)
  };
}



export default connect(mapStateToProps,mapDispatchToProps)(travelWrapper(Dashboard));