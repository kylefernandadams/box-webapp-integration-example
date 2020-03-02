import React from 'react';
import { BrowserRouter as Router , Switch, Route } from "react-router-dom";
import Main from './Main';
import 'box-ui-elements/dist/explorer.css';
import 'box-ui-elements/es/styles/base.scss';
import './App.css';
export default function App() {

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" component={Main} />>
          <Route path="/webapp-integration-example" component={Main} />
          <Route path="/users" component={Users} />>
        </Switch>
      </div>
    </Router>
  );
}
function Users() {
  return <h2>Users</h2>;
}

 