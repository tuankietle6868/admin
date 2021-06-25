import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow
} from '@coreui/react';

// import usersData from '../users/UsersData';


const getBadge = status => {
  switch (status) {
    case 'Kích hoạt': return 'success'
    case 'Inactive': return 'secondary'
    case 'Chờ duyệt': return 'warning'
    case 'Cấm': return 'danger'
    default: return 'primary'
  }
}
const fields = ['Name','UtilityId', 'Unit', 'UserId']

const Tables = () => {

  const [usersData, setUsersData] = useState([]);
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/utilities/all')
    .then(res => {
      setUsersData(res.data);
    })
  }, []);
  
  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              Danh sách bất động sản chủ nhà
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={usersData}
              fields={fields}
              itemsPerPage={5}
              pagination
              scopedSlots = {{
                'status':
                  (item)=>(
                    <td>
                      <CBadge color={getBadge(item.status)}>
                        {item.status}
                      </CBadge>
                    </td>
                  )
              }}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Tables
