import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import TimerList from './timer-list';
import TimerSpecific from './timer-specific';

export class ScreenIndex extends Component {

    _componentDidCatch(error, errorInfo) {
        // TODO: do something when error occured.
    }

    render() {
        const { match } = this.props;
        return (
            <Switch>
                <Route exact path={match.path} component={TimerList} />
                <Route path={match.path + "/:id"} component={TimerSpecific} />
                <Redirect push to={match.path + "/"} />
            </Switch>
        )
    }
}

export default withRouter(ScreenIndex);
