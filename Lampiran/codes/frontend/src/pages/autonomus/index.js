import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ExamExtractIndex from './exam-extract'

function AutonomusIndex({ match }) {
    return (
        <Switch>
            <Route path={match.path + "/exam-extract/:token"} component={ExamExtractIndex} />
        </Switch>
    )
}

export default AutonomusIndex
