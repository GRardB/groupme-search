import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Home } from './pages/Home'
import { OauthCallback } from './pages/OauthCallback'

import './index.css'

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/oauth">
        <OauthCallback />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>
)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

