import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination
} from '@coreui/react'


const getBadge = status => {
  switch (status) {
    case 'Kích hoạt': return 'success'
    case 'Inactive': return 'secondary'
    case 'Chờ duyệt': return 'warning'
    case 'Cấm': return 'danger'
    default: return 'primary'
  }
}

function Users() {

  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/users?page=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page])

  /* =====> API GET Data <===== */
  const [number, setNumber] = useState(5); // Set Pages Number
  const [usersData, setUserData] = useState([]);
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/users/getallusers')
    .then(res => {
      let data = res.data
      setUserData(data);
      setNumber(Math.ceil((data).length / 5));
    })
  }, [1]);

  return (
    <CRow>
      <CCol xl={12}>
        <CCard>
          <CCardHeader>
            Quản lý
            <small className="text-muted"> Người dùng</small>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={usersData}
            fields={[
              { key: 'UserId', _classes: 'font-weight-bold' },
              'PhoneNumber', 'Name', 'Birth', 'Sex', 'Address', 'IdCard', 'Type', 'AvatarIMG', 'Status', 'GroupNameId'
            ]}
            hover
            striped
            itemsPerPage={5}
            activePage={page}
            clickableRows
            onRowClick={(item) => history.push(`/users/${item.UserId}`)}
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
          <CPagination
            activePage={page}
            onActivePageChange={pageChange}
            pages={number}
            doubleArrows={true} 
            align="center"
          />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Users
