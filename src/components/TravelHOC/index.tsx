
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../reducers';
import * as ProfileActions from '../../actions/profile';
import { bindActionCreators } from 'redux';



export namespace TravelWrapper {
    export interface Props extends RouteComponentProps<void>{
        profileactions:typeof ProfileActions
    }

    export interface State {

    }
}

//HOC to wrap containers for preparing current user info
function travelWrapper(WrappedComponent) {
        return connect(mapStateToProps,mapDispatchToProps) 
            (class  extends React.Component<TravelWrapper.Props,TravelWrapper.State> {
            componentDidMount()
            {
                //  console.log('BaseComponent cpdm');

                this.props.profileactions.getStaffMaster(_spPageContextInfo.userId);
                // this.props.profileactions.getAppConfig(_spPageContextInfo.userId);
            }


            render(){
              //  console.log(`Rendering ${WrappedComponent.displayName}`);
                return (
                    <WrappedComponent {...this.props} />    
                )
            }
        })
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}


function mapStateToProps(state: RootState) {
    return {
      
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      profileactions: bindActionCreators(ProfileActions as any, dispatch)
    };
  }

export default travelWrapper;