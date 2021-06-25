import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useForm } from "react-hook-form";
import { useCookie } from '@use-hook/use-cookie';
import { useHistory, useLocation } from 'react-router-dom';

import { 
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CDataTable,
  CPagination,
  CCardFooter,
  CButton,
  CForm,
  CFormGroup,
  CFormText,
  CLabel,
  CInputCheckbox 
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

function Update({match}) {

  const { register, reset, errors, handleSubmit } = useForm('');
  const defaultValues = {
    Name: '',
    Description: ''
  };
  const resetForm = () => {
    reset(defaultValues);
  }

  /* =====> Cookie <===== */
  const [ClientId]    = useCookie('Client');
  const [AccessToken] = useCookie('X-Auth-Token');

  /* =====> Back to permission <===== */
  const history = useHistory();
  const handleBack = () => {
    history.push('/group');
  }

  /* =====> API GET Data GroupName <===== */
  const [onLoad, setOnLoad] = useState(false);
  const [groupName, setGroupName] = useState([]);
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/groupnames')
    .then(res => {
      setGroupName(res.data);
    })
  }, [onLoad]);

  /* =====> Data From List <===== */
  const groups = groupName.find( groups => groups.GroupNameId.toString() === match.params.GroupNameId)
  const groupsDetails = groups ? Object.entries(groups) : 
    [['id', (<span><CIcon className="text-muted" /> Not found</span>)]]
  const Id = match.params.GroupNameId;


  /* =====> API Get Data Permission <===== */
  const [permissionId, setPermissionsId] = useState([]);

  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/permissions')
    .then(res => {
      setPermissionsId(res.data);
    })
  }, []);

  var abc = [];

  // const aaa = e => {
  //   console.log(e.target.value)
  //   if (e.target.value === false) {
  //     abc.pop(e.target.value);
  //   } else {
  //     abc.push(e.target.value);
  //   }

  // } 

  const onSubmit = data => {
    if (data === false) {
      abc.pop(data);
    } else {
      abc.push(data);
    }
    Axios.put('http://' + window.location.hostname + '/v1/groupnames/permissions',
    {
      'GroupNameId': Id,
      'PermissionIds': abc
    }
    )
    .then(res => {
      console.log(res.data);
    })
  }
  


  /* =====> Current Page <===== */
  // const history = useHistory()
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  
  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/group?page=${newPage}`)
  }
  
  const [number, setNumber] = useState(1); // Set Pages number
  // const [onLoad, setOnLoad] = useState(false);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/groupnames/' + Id + '/permissions')
    .then(res => {
      let data = res.data;
      setPermissions(data);
      if (data !== null)
        setNumber(Math.ceil((data).length / 5));
    })
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page, onLoad]);



  return (
    <CRow>
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
            Permission Id: {match.params.GroupNameId}
          </CCardHeader>
          <CCardBody>
              <table className="table table-striped table-hover">
                <tbody>
                  {
                    groupsDetails.map(([key, value], index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>{`${key}:`}</td>
                          <td><strong>{value}</strong></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
            Danh sách
            <small className="text-muted"> Các quyền của nhóm</small>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={permissions}
            fields={[
              { key: 'PermissionId', _classes: 'font-weight-bold' },
              'PermissionName', 'PermissionDescription'
            ]}
            hover
            striped
            itemsPerPage={5}
            activePage={page}
            clickableRows
            // onRowClick={(item) => history.push(`/group/${item.GroupNameId}`)}
          />
          <CPagination
            activePage={page}
            onActivePageChange={pageChange}
            pages={number}
            doubleArrows={false} 
            align="center"
          />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs="12" md="12">
        <CCard>
          <CCardHeader>
            Cập nhật
            <small> Quyền cho nhóm này</small>
            <span style={{ float: "right", color: "#bd0000"}}></span>
          </CCardHeader>
          <CCardBody>
            <CForm action="" method="" className="form-horizontal">
              <CCol xs="12" md="12">
                <CFormGroup row>
                  {permissionId.map((d, i) => (
                    <CFormGroup 
                      variant="checkbox" 
                      className="checkbox col-md-4"
                      key={i}  
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkbox1" 
                        name={d.PermissionName} 
                        value={d.PermissionId}
                        ref={register}
                      />
                      <CLabel 
                        variant="checkbox" 
                        className="form-check-label" 
                        htmlFor={d.PermissionName}
                        style={{fontSize: "18px", marginBottom: "20px"}}
                      >
                        {d.PermissionDescription}
                      </CLabel>
                    </CFormGroup>
                  ))}
                </CFormGroup>
              </CCol>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" onClick={handleSubmit(onSubmit)}>
              <CIcon name="cilTask" /> Cập nhật
            </CButton>
            <CButton type="reset" size="sm" color="danger">
              <CIcon name="cilX" /> Hủy
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Update;
