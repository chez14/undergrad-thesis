import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainIndex from '~/pages/index/Index';
import AdminController from '~/pages/admin/Admin';
import ExamController from '~/pages/exam/Exam';
import { library } from '@fortawesome/fontawesome-svg-core'

import ExamStore from '~/store/examStore';
import { Provider } from "mobx-react";
import { faMehRollingEyes, faSurprise, faMeh, faGrinTears, faDizzy, faLemon, faUserCircle, faBell } from '@fortawesome/free-regular-svg-icons'
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import AdminStore from '~/store/adminStore';
import EntityStore from '~/store/entityStore';
import AutonomusIndex from '~/pages/autonomus';
library.add(faMehRollingEyes, faSurprise, faMeh, faGrinTears, faDizzy, faLemon, faUserCircle, faBell, faCloudUploadAlt);

class App extends Component {
  render() {
    return (
      <Provider examStore={new ExamStore()} adminStore={new AdminStore()} entityStore={new EntityStore()}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={MainIndex} />
            <Route path="/exam" component={ExamController} />
            <Route path="/admin" component={AdminController} />
            <Route path="/autonomus" component={AutonomusIndex} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;