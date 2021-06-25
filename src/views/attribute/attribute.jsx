import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useForm } from "react-hook-form";
import { useCookie } from '@use-hook/use-cookie';
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

function Attribute() {

  const { register, reset, errors, handleSubmit } = useForm('');
  const defaultValues = {
    Description: ''
  };
  const resetForm = () => {
    reset(defaultValues);
  }

  // Cookie
  const [ClientId]    = useCookie('Client');
  const [AccessToken] = useCookie('X-Auth-Token');

  /* =====> Current Page <===== */
  const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/attributes?page=${newPage}`)
  }

  /* =====> API GET Data Permissions <===== */
  const [number, setNumber] = useState(1); // Set Pages number
  const [onLoad, setOnLoad] = useState(false);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/attributes/parents/0')
    .then(res => {
      let data = res.data;
      console.log(data);
      setAttributes(data);
      setNumber(Math.ceil((data).length / 50));
    })
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page, onLoad])

  /* =====> API POST Attribute <===== */
  const [nofiti, setNofiti] = useState('');
  const onSubmit = data => {
    Axios.post('http://' + window.location.hostname + '/v1/attributes',
    {
      'Name': data.Name,
      'ParentId': data.AttributeId
    },
    {headers:
      {
        'Client': ClientId,
        'X-Auth-Token':  AccessToken
      }
    })
    .then(res => {
      if (typeof(res.data) === 'object') {
        setOnLoad(true);
        setNofiti('Thêm thành công!');
        resetForm();
        setTimeout(() => {
          setOnLoad(false);
          setNofiti('');
        }, 1000);
      }
    })
  }



  return (
    <CRow>
      <CCol xs="12" md="12">
        <CCard>
          <CCardHeader>
            Thêm
            <small> Đặc tính</small>
            <span style={{ float: "right", color: "#bd0000"}}>{nofiti}</span>
          </CCardHeader>
          <CCardBody>
            <CForm action="" method="post" className="form-horizontal">
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-email">Tên thuộc tính</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <input
                    id="Name"
                    className="form-control"
                    type="text"
                    name="Name"
                    placeholder="Tên thuộc tính..."
                    ref={register({ required: true })}
                  />
                  {errors.Name ?.type === "required" &&
                    <CFormText className="help-block">
                      Nhập tên cho thuộc tính này!
                    </CFormText>
                  }
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="Attribute">Thuộc tính </CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <select
                    id="Attribute"
                    className="form-control"
                    name="AttributeId"
                    ref={register({ required: true })}
                  >
                    <option value="0">Không có</option>
                    {attributes.map((d, i) => (
                      <option value={d.AttributesId} key={i}>{d.Name}</option>
                    ))}
                  </select>
                </CCol>
              </CFormGroup>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" onClick={handleSubmit(onSubmit)}>
              <CIcon name="cilTask" /> Thêm
            </CButton>
            <CButton type="reset" size="sm" color="danger">
              <CIcon name="cilX" /> Hủy
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol xs="12" md="12">
        <CCard>
          <CCardHeader>
            Danh sách
            <small className="text-muted"> Các thuộc tính</small>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={attributes}
            fields={[
              { key: 'ParentId', _classes: 'font-weight-bold' },
              'Name', 'Unit'
            ]}
            hover
            striped
            itemsPerPage={50}
            activePage={page}
            clickableRows
            onRowClick={(item) => history.push(`/attributes/${item.AttributesId}`)}
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

export default Attribute;
