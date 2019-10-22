import * as React from "react";
import * as PropTypes from "prop-types";
import {Link} from 'react-router-dom';
import { Router, Route, Switch } from 'react-router';


interface MiNavLinkProps {
  to: any,
  exact: boolean,
  strict: boolean,
  location: any,
  activeClassName: string,
  className: string,
  activeStyle: any,
  style: any,
  // isActive: Function,
  text:string,
  iconClassName:string,
  // "aria-current": PropTypes.oneOf([
  //   "page",
  //   "step",
  //   "location",
  //   "date",
  //   "time",
  //   "true"
  // ])
}

interface MiNavLinkState {
  location:any;
}

// const LiNavLink: React.SFC<MiNavLinkProps> = (props) => {
//   const {to,exact,strict,location,activeClassName,className,activeStyle,style,isActive,text,iconClassName,...rest} = props;

//   const path = typeof to === "object" ? to.pathname : to;
//   const getIsActive = props.isActive;
  
  
//     // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
//     const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  
//     return <Route
//         path={escapedPath}
//         exact={exact}
//         strict={strict}
//         location={location}
//         children={({ location, match }) => {
//           //const isActive = !!(getIsActive ? getIsActive(match, location) : match);
//           const isActive = path == location.pathname;

//           return (
//             <li className={
//               isActive
//                 ? [className, activeClassName].filter(i => i).join(" ")
//                 : className
//             }>
//             <Link
//               to={to}
//               // className={
//               //   isActive
//               //     ? [className, activeClassName].filter(i => i).join(" ")
//               //     : className
//               // }
//               style={isActive ? { ...style, ...activeStyle } : style}
//               {...rest}
//             ><i className={iconClassName}></i>{text}</Link></li>
//           );
//         }}
//       />
    
// }



class LiNavLink extends React.Component<MiNavLinkProps,MiNavLinkState> {
  constructor(props){
    super(props);

    this.state = {
      location:this.props.location
    };


  }

  componentWillReceiveProps(nextProps: MiNavLinkProps){
    if(nextProps.location)
    {
      this.setState({
        location:nextProps.location
      })
    }
  }

  render(){
    const {to,exact,strict,location,activeClassName,className,activeStyle,style,text,iconClassName,...rest} = this.props;
      const path = typeof to === "object" ? to.pathname : to;
  // const getIsActive = this.props.isActive;
  
  
    // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
    const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  
    return <Route
        path={escapedPath}
        
        exact={exact}
        strict={strict}
        location={this.state.location}
        children={({ location, match }) => {
          //const isActive = !!(getIsActive ? getIsActive(match, location) : match);
          const isActive = path == this.state.location.pathname;

          return (
            <li className={
              isActive
                ? [className, activeClassName].filter(i => i).join(" ")
                : className
            }>
            <Link
              to={to}
              // className={
              //   isActive
              //     ? [className, activeClassName].filter(i => i).join(" ")
              //     : className
              // }
              style={isActive ? { ...style, ...activeStyle } : style}
              {...rest}
            ><i className={iconClassName}></i>{text}</Link></li>
          );
        }}
      />
  }


}

 export default LiNavLink;