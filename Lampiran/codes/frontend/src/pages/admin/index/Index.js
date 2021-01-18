import React, { Component } from 'react';
import { Else, If, Then } from 'react-if';
import { Redirect, withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react"
import Mainindex from './Mainindex';
import Nologin from './Nologin';

class Index extends Component {
  render() {
    const { adminStore, match } = this.props;

    return (
      <>
        <If condition={!adminStore.user}>
          <Then>
            <Nologin />
          </Then>
          <Else>
            <Mainindex />
            <Redirect path={match.path} exact to="/admin/exam/" />
          </Else>
        </If>
      </>
    )
  }
}

export default inject("adminStore")(
  withRouter(
    observer(Index)
  )
);