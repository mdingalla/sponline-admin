import * as React from 'react';
import { Link } from 'react-router-dom'
import SideNavigation from './navigation';
import '!style-loader!css-loader!./override.css';
import { Store } from 'redux';
import { RootState } from '../../reducers';
import { bindActionCreators } from 'redux';
// import * as TodoActions from '../../actions/todos';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RouterState } from 'react-router-redux';
import * as style from './style.css';

export namespace Layout {
    export interface Props extends RouteComponentProps<void>{
        store:Store<RootState>;
        history:any;
        router:any
        
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Layout extends React.Component<Layout.Props> {
  
  componentDidMount(){
    // window.addEventListener('unload',function() {
    //     SetFullScreenMode(false);
    // });
    
    
   
    // window.addEventListener('load',function() {
    //     SetFullScreenMode(true);
    // });

    let titlerow = document.getElementById('titlerow');
    if(titlerow) titlerow.style.display = "none";

    let sideNavBox = document.getElementById('sideNavBox');
    if(sideNavBox) sideNavBox.style.display = "none";

   
  }

  componentWillUnmount(){
    let titlerow = document.getElementById('titlerow');
    if(titlerow) titlerow.style.display = "block";

    let sideNavBox = document.getElementById('sideNavBox');
    if(sideNavBox) sideNavBox.style.display = "block";
}

  
  render() {
    let navSideBarStyle = {height: '1px;'}
    return (
      <div id="mainLayout">
        <div id="pageWrapper" className={style.pageWrapper} >
          {this.props.children}
        </div>
        
      </div>
    );
  }


}

function mapStateToProps(state: RootState) {
  return {
    // todos: state.todos,
    router:state.router
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // actions: bindActionCreators(TodoActions as any, dispatch)
  };
}
