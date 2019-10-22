import * as React from 'react';
// import * as TodoActions from '../../actions/todos';
import * as style from './style.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../reducers';
// import { TravelForm } from '../../components/TravelForm';
import { props } from 'bluebird';

import travelWrapper from '../../components/TravelHOC';
import { TodoItemData } from '../../../types/models';


export namespace TravelApp {
  export interface Props extends RouteComponentProps<void> {
    todos: TodoItemData[];
    // actions: typeof TodoActions;
  }

  export interface State {
    /* empty */
  }
}

// @connect(mapStateToProps, mapDispatchToProps)
export class TravelApp extends React.Component<TravelApp.Props, TravelApp.State> {

  displayName = 'Travel App'

  render() {
    // const { todos, actions, children } = this.props;
    return (
      <div className="row-fluid">
        {/* <TravelForm {...this.props} /> */}
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    todos: state.todos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // actions: bindActionCreators(TodoActions as any, dispatch)
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(travelWrapper(TravelApp));
