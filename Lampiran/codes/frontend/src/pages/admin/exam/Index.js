import React from 'react';
import { observer } from 'mobx-react';
import { Route, Switch, Redirect } from "react-router-dom";
import Exam from './Exam';
import Detail from './detail/Detail';
import AdminNavbar from '~/components/admin/navbar/AdminNavbar';
import Participants from './participants/Participants';
import ExamCreate from './create/create';
import ScreenTime from './screentime/screen';
import ExamMinipanel from './detail/minipanel/minipanel';

function Index({ match }) {
  return (
    <>
      <AdminNavbar />
      <Switch>
        <Route exact path={match.path} component={Exam} />
        <Route path={match.path + "/new"} component={ExamCreate} />
        <Route path={match.path + "/:id/minipanel"} component={ExamMinipanel} />
        <Route path={match.path + "/:id/detail"} component={Detail} />
        <Route path={match.path + "/:id/participant"} component={Participants} />
        <Route path={match.path + "/:id/screen"} component={ScreenTime} />
        <Redirect push to={match.path + "/"} />
      </Switch>
    </>
  )
}

export default observer(Index);