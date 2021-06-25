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
  CLabel
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

function GroupUser() {

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
    currentPage !== newPage && history.push(`/groupuser?page=${newPage}`)
  }

  /* =====> API GET Data Permissions <===== */
  const [number, setNumber] = useState(1); // Set Pages number
  const [onLoad, setOnLoad] = useState(false);  
  const [user,   setUser]   = useState([]);
  const [group,  setGroup]  = useState([]);


  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/users/getallusers')
    .then(res => {
      let data = res.data;
      setUser(data);
      setNumber(Math.ceil((data).length / 25));
    })
    Axios.get('http://' + window.location.hostname + '/v1/groupnames')
    .then(res => {
      setGroup(res.data);
    })
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page, onLoad]);

  /* =====> API POST Attribute <===== */
  const [nofiti, setNofiti] = useState('');
  const onSubmit = data => {
    Axios.put('http://' + window.location.hostname + '/v1/groupnames/users',
    {
      'GroupNameId': data.GroupNameId,
      'UserId': data.UserId
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
            Cấp quyền
            <small> người dùng</small>
            <span style={{ float: "right", color: "#bd0000"}}>{nofiti}</span>
          </CCardHeader>
          <CCardBody>
            <CForm action="" method="post" className="form-horizontal">
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-email">Chọn người dùng</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <select
                    className="form-control"
                    type="text"
                    name="UserId" 
                    ref={register}
                  >
                    {user.map((d, i) => (
                      <option value={d.UserId} key={i}>{`${d.PhoneNumber} - ${d.Name}`}</option>
                    ))}
                  </select>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="Attribute">Tên nhóm </CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <select
                    className="form-control"
                    name="GroupNameId" 
                    ref={register}  
                  >
                    {group.map((d, i) => (
                      <option value={d.GroupNameId} key={i}>
                        {` ${d.GroupNameName} - ${d.GroupNameDescription}`}
                      </option>
                    ))}
                  </select>
                  {errors.AttributeId ?.type === "required" &&
                    <CFormText className="help-block">
                      Nhập mô tả cho quyền này!
                    </CFormText>
                  }
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
            <small className="text-muted"> Người dùng</small>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={user}
            fields={[
              { key: 'UserId', _classes: 'font-weight-bold' },
              'PhoneNumber', 'Name', 'GroupNameId'
            ]} 
            hover
            striped
            itemsPerPage={25}
            activePage={page}
            clickableRows
            // onRowClick={(item) => history.push(`/group/${item.GroupNameId}`)} 
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

export default GroupUser;
