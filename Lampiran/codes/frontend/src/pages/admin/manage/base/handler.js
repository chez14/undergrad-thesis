import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import EntityEditor from './editor';
import EntityIndex from './index';

function EntityHandler({ globalEntityRules, entityRules }) {
    const match = useRouteMatch("/admin/manage/:entity");
    return (
        <Switch>
            <Route path={match.url} exact><EntityIndex globalEntityRules={globalEntityRules} entityRules={entityRules} /></Route>
            <Route path={match.url + "/:id"}><EntityEditor globalEntityRules={globalEntityRules} entityRules={entityRules} entityName={match.params.entity} /></Route>
        </Switch>
    )
}

export default EntityHandler
