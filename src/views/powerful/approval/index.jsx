import React from 'react';
import { CRow } from '@coreui/react'
import Add from './add';
import List from './list';


function Approval() {

  return (
    <CRow>
      <Add />
      <List />
    </CRow>
  )
}

export default Approval;
