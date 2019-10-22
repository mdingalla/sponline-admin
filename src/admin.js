"use strict";
exports.__esModule = true;
require("./polyfill");
var React = require("react");
var ReactDOM = require("react-dom");
var react_redux_1 = require("react-redux");
var history_1 = require("history");
var store_1 = require("./store");
var Layout_1 = require("./containers/Layout");
var admin_1 = require("./routes/admin");
var react_router_redux_1 = require("react-router-redux");
var Icons_1 = require("office-ui-fabric-react/lib/Icons");
require("!style-loader!css-loader!./index.css");
require("!style-loader!css-loader!./sb-admin.css");
Icons_1.initializeIcons();
var store = store_1.configureStore();
var history = history_1.createBrowserHistory();
ReactDOM.render(<react_redux_1.Provider store={store}>
    <react_router_redux_1.ConnectedRouter history={history}>
    <Layout_1["default"] history={history} {...this.props}>
      <admin_1["default"] />
      </Layout_1["default"]>
    </react_router_redux_1.ConnectedRouter>

  </react_redux_1.Provider>, document.getElementById('root'));
