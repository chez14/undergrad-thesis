import React from 'react';
import { observer } from 'mobx-react';

import moment from 'moment';
import 'moment/locale/id';

moment.locale("id");

const Buildinfo = () => {
  return (
    <>
      <b>Oxam v5.0</b>: Into the abyss | Built on {moment(process.env.REACT_APP_BUILD_DATE || Date.now()).format("LLLL")}, Commit: {process.env.REACT_APP_BUILD_COMMIT || "dev"}
    </>
  )
}
Buildinfo.propTypes = {
}

export default (observer(Buildinfo));