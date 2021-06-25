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
} from '@coreui/react'
import CIcon from '@coreui/icons-react';

function Permission() {

  const { register, reset, errors, handleSubmit } = useForm('');
  const defaultValues = {
    Name: '',
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
    currentPage !== newPage && history.push(`/group?page=${newPage}`)
  }

  const [number, setNumber] = useState(1);
  const [onLoad, setOnLoad] = useState(false);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/groupnames')
    .then(res => {
      let data = res.data;
      setGroups(data);
      setNumber(Math.ceil((data).length / 5));
    })
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page, onLoad])


  /* =====> API POST Permission <===== */
  const [nofiti, setNofiti] = useState('');
  const onSubmit = data => {
    Axios.post('http://' + window.location.hostname + '/v1/groupnames',
    {
      'GroupNameName': data.Name,
      'GroupNameDescription': data.Description
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
          setNofiti('');
          setOnLoad(false);
        }, 1000);
      }
    })
  }

  return (
    <CRow>
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
            Thêm
            <small> Nhóm</small>
            <span style={{ float: "right", color: "#bd0000"}}>{nofiti}</span>
          </CCardHeader>
          <CCardBody>
            <CForm action="" method="post" className="form-horizontal">
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-email">Tên nhóm</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <input
                    id="Name"
                    className="form-control"
                    type="text"
                    name="Name" 
                    placeholder="Tên nhóm..."
                    ref={register({ required: true })}  
                  />
                  {errors.Name ?.type === "required" &&
                    <CFormText className="help-block">
                      Nhập tên cho nhóm này!
                    </CFormText>
                  }
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="Description">Mô tả</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <input
                    id="Description"
                    className="form-control"
                    type="text"
                    name="Description" 
                    placeholder="Mô tả..."
                    ref={register({ required: true })}  
                  />
                  {errors.Description ?.type === "required" &&
                    <CFormText className="help-block">
                      Nhập mô tả cho nhóm này!
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
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
            Danh sách
            <small className="text-muted"> Các nhóm</small>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={groups}
            fields={[
              { key: 'GroupNameId', _classes: 'font-weight-bold' },
              'GroupNameName', 'GroupNameDescription'
            ]} 
            hover
            striped
            itemsPerPage={5}
            activePage={page}
            clickableRows
            onRowClick={(item) => history.push(`/group/${item.GroupNameId}`)} // Detail => GroupNameId
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

export default Permission;
