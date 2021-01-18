import React from 'react'
import { Route, Switch } from "react-router-dom"
import { entityRules } from './rules';
import AdminNavbar from '~/components/admin/navbar/AdminNavbar';
import EntityHandler from './base/handler';


function Manage({ match }) {
    return (
        <>
            <AdminNavbar />
            <Switch>
                <Route path={match.path + "/lectures"}><EntityHandler globalEntityRules={entityRules} entityRules={entityRules.lecture} /></Route>
                <Route path={match.path + "/lectureperiods"}><EntityHandler globalEntityRules={entityRules} entityRules={entityRules.lectureperiod} /></Route>
                <Route path={match.path + "/locations"}><EntityHandler globalEntityRules={entityRules} entityRules={entityRules.locations} /></Route>
                <Route path={match.path + "/admins"}><EntityHandler globalEntityRules={entityRules} entityRules={entityRules.admins} /></Route>
                <Route path={match.path + "/iplogins"}><EntityHandler globalEntityRules={entityRules} entityRules={entityRules.iplogins} /></Route>
                <Route path={match.path + "/acls"}><EntityHandler globalEntityRules={entityRules} entityRules={entityRules.acls} /></Route>
                <Route path={match.path + "/computers"}><EntityHandler globalEntityRules={entityRules} entityRules={entityRules.computers} /></Route>
                <Route path={match.path + "/exams"}><EntityHandler globalEntityRules={entityRules} entityRules={entityRules.exams} /></Route>
            </Switch>
        </>
    )
}

export default Manage
