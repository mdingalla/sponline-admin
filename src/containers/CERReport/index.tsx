import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../reducers';
import travelWrapper from '../../components/TravelHOC';
import { CERReportPage } from '../../components/CERReport';
import { GroupsPagePath } from '../../constants/config';
import GroupsPage from '../../components/Groups';

export namespace Dashboard {
  export interface Props extends RouteComponentProps<void> {
    
  }

  export interface State {
    /* empty */
  }
}


export class Dashboard extends React.Component<Dashboard.Props, Dashboard.State> {
  constructor(props)
  {
    super(props);
  }

  
  
  render() {

    let form = null;

    switch (this.props.match.path) {
      
      case GroupsPagePath:
        form = <GroupsPage />;
        break;
      
    
      default:
        form = <CERReportPage />;
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