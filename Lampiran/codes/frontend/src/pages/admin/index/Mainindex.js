import React, { Component } from 'react';
import { observer } from 'mobx-react';
import AdminNavbar from '~/components/admin/navbar/AdminNavbar';

class Mainindex extends Component {
  render() {
    return (
      <>
        <AdminNavbar />
      </>
    )
  }
}
Mainindex.propTypes = {
}

export default (observer(Mainindex));