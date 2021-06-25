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
  CPagination,
  CButton,
  CCardFooter,
  CForm,
  CFormGroup,
  CFormText,
  CLabel,
  CSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

const getBadge = status => {
  switch (status) {
    case 'Kích hoạt': return 'success'
    case 'Inactive': return 'secondary'
    case 'Chờ duyệt': return 'warning'
    case 'Cấm': return 'danger'
    default: return 'primary'
  }
}

const Parents = ({match}) => {

  /* =====> API GET Data Attribute <===== */
  const [attributes, setAttributes] = useState([]);
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/attributes/all')
    .then(res => {
      let data = res.data;
      setAttributes(data);
    })
  }, []);

  /* =====> Current Page <===== */
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/parents?page=${newPage}`)
  }

  /* =====> API Get Parents <===== */
  const [number, setNumber] = useState(1); // Set Pages number
  const [parentId, setParentId] = useState('00');
  const [parents, setParents]   = useState([]);

  const Id = match.params.AttributesId;

  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/attributes/parents/' + Id)
    .then(res => {
      let data = res.data;
      setParents(data);
      setNumber(Math.ceil((data).length / 50));
    })
    currentPage !== page && setPage(currentPage)
  }, [parentId, currentPage, page]);


  return (

      <CCol xs="12" md="12">
        <CCard>
          <CCardHeader>
            Danh sách
            <small className="text-muted"> Thuộc tính</small>
            <select className="form-control" onChange={e => setParentId(e.target.value)}>
              <option value="0">Mặc định</option>
              {attributes.map((d, i) => (
                <option value={d.AttributesId} key={i}>{d.Name}</option>
              ))}
            </select>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={parents}
            fields={[
              { key: 'AttributesId', _classes: 'font-weight-bold' },
              'ParentId', 'Name'
            ]}
            hover
            striped
            itemsPerPage={50}
            activePage={page}
            clickableRows
            onRowClick={(item) => history.push(`/attributes/${item.ParentId}`)}
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
  )
}

export default Parents;
