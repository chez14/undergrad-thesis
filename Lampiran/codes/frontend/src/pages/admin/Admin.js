import React from 'react';
import { observer } from 'mobx-react';

import { Route, Switch } from "react-router-dom";
import Login from './account/login/Login';
import Exam from './exam/Index';
import Index from './index/Index';
import Manage from './manage/Manage';
import ScreenIndex from './screen';

function Admin({ match }) {
  return (
    <>
      <Switch>
        <Route exact path={match.path} component={Index} />
        <Route path={match.path + "/account/login"} component={Login} />
        <Route path={match.path + "/exam"} component={Exam} />
        <Route path={match.path + "/screen"} component={ScreenIndex} />
        <Route path={match.path + "/manage"} component={Manage} />
      </Switch>
    </>
  )
}

export default (observer(Admin));