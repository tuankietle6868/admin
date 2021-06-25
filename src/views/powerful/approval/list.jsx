import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { loadSelector } from '../../../reducers/approval';
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CPagination
} from '@coreui/react';

// const getBadge = ProvinceId => {
//   switch (ProvinceId) {
//     case 'Kích hoạt': return 'success'
//     case 'Từ chối': return 'secondary'
//     case 'Chờ duyệt': return 'warning'
//     case 'Cấm': return 'danger'
//     default: return 'primary'
//   }
// }


function List() {

  const load = useSelector(loadSelector);
  console.log(load);

  /* =====> Current Page <===== */
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([ 0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/approval?page=${newPage}`)
  }

  const [number, setNumber] = useState(1); // Set Pages number
  const [approval, setApproval] = useState([]); 
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/approvalmanager')
    .then(res => {
      let data = res.data;
      setApproval(data);
      setNumber(Math.ceil((data).length / 5));
    })
    currentPage !== page && setPage(currentPage)
  }, [1, load, currentPage, page])

  return (
    <CCol xs="12" md="6">
      <CCard>
        <CCardHeader>
          Danh sách
          <small className="text-muted"> Các khu vực</small>
        </CCardHeader>
        <CCardBody>
          <CDataTable
          items={approval}
          fields={[
          { key: 'ApprovalManagerId', _classes: 'font-weight-bold' },
          'ProvinceId', 'DistrictId', 'WardId', 'UserId', 'GroupNameId'
          ]}
          hover
          striped
          itemsPerPage={5}
          activePage={page}
          clickableRows
          onRowClick={(item) => history.push(`/approval/${item.ApprovalManagerId}`)} // Details => ApprovalManagerId
          // scopedSlots = {{
          // 'ProvinceId':
          // (item)=>(
          // <td>
          //   <CBadge color={getBadge(item.ProvinceId)}>
          //     {item.ProvinceId}
          //   </CBadge>
          // </td>
          // )
          // }}
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
  );
}

export default List;
