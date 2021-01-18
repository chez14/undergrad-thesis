import React from 'react';
import { Helmet } from "react-helmet";
import { helmet } from "~/config";

const WrappedHelmet = (props) => {
  return (
    <Helmet {...helmet} {...props}/>
  )
}

export default WrappedHelmet;