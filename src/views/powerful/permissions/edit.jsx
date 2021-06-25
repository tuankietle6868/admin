import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useForm } from "react-hook-form";
import { useCookie } from '@use-hook/use-cookie';
import { useHistory } from 'react-router-dom';
import { 
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CCardFooter,
  CButton,
  CForm,
  CFormGroup,
  CFormText,
  CLabel,
  CSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

const Edit = ({match}) => {

  const { register, reset, errors, handleSubmit } = useForm('');
  const defaultValues = {
    Description: ''
  };
  const resetForm = () => {
    reset(defaultValues);
  }

  /* =====> Cookie <===== */
  const [ClientId]    = useCookie('Client');
  const [AccessToken] = useCookie('X-Auth-Token');

  /* =====> Back To Permission <===== */
  const history = useHistory();
  const handleBack = () => {
    history.push('/permissions');
  }

  /* =====> API GET Data <===== */
  const [onLoad, setOnLoad] = useState(false);
  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/permissions')
    .then(res => {
      setPermissions(res.data);
    })
  }, [1, onLoad]);

  /* =====> Data From List <===== */
  const permiss = permissions.find( permiss => permiss.PermissionId.toString() === match.params.PermissionId)
  const permissDetails = permiss ? Object.entries(permiss) : 
    [['id', (<span><CIcon className="text-muted" /> Not found</span>)]]
  const Id = match.params.PermissionId;

  const handleOpenEdit = () => {
    setOnLoad(false);
    setOpenEdit(true);
  }

  /* =====> API PUT <===== */
  const [openEdit, setOpenEdit] = useState(false);
  const [notifi, setNotifi]     = useState('');
  const onSubmit = data => {
    setOpenEdit(false);
    Axios.put('http://' + window.location.hostname + '/v1/permissions',
    {
      'PermissionId': Id,
      'PermissionName': data.Name,
      'PermissionDescription': data.Description
    },
    {headers:
      {
        'Client': ClientId,
        'X-Auth-Token':  AccessToken
      }
    })
    .then(res => {
      if (typeof(res.data) === 'object') { // Edited
        setOnLoad(true);
        setNotifi('Chỉnh sửa thành công!');
        resetForm();
        setTimeout(() => {
          setNotifi('');
        }, 1000);
      }
    })
  }
  /* =====> API Delete ?????????? <===== */
  const handleDelete = () => {
    Axios.DELETE('http://' + window.location.hostname + '/v1/permissions' + Id,
    {headers:
      {
        'Client': ClientId,
        'X-Auth-Token':  AccessToken
      }
    })
    .then(res => {
      console.log(res.data);
    })
  }

  return (
    <CRow>
      <CCol xs="12" md="6" style={{ display: openEdit ? "block" : "none"}}>
        <CCard>
          <CCardHeader>
            Chỉnh sửa
            <small> Quyền</small>
          </CCardHeader>
          <CCardBody>
            <CForm action="" method="post" className="form-horizontal">
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-email">Các loại quyền</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <input
                    id="Name"
                    className="form-control"
                    type="text"
                    name="Name" 
                    placeholder="Tên quyền..."
                    ref={register({ required: true })}  
                  />
                  {errors.Name ?.type === "required" &&
                    <CFormText className="help-block">
                      Nhập tên cho nhóm quyền này!
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
                      Nhập mô tả cho quyền này!
                    </CFormText>
                  }
                </CCol>
              </CFormGroup>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" onClick={handleSubmit(onSubmit)}>
              <CIcon name="cilTask" /> Đồng ý
            </CButton>
            <CButton type="reset" size="sm" color="danger" onClick={e => setOpenEdit(false)}>
              <CIcon name="cilX" /> Hủy
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
            Permission Id: {match.params.PermissionId}
            <span style={{ float: "right", color: "#bd0000"}}>{notifi}</span>
          </CCardHeader>
          <CCardBody>
              <table className="table table-striped table-hover">
                <tbody>
                  {
                    permissDetails.map(([key, value], index) => {
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
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" onClick={handleOpenEdit}> 
              <CIcon name="cilSettings" /> Chỉnh sửa
            </CButton>
            <CButton type="submit" size="sm" color="primary" onClick={handleDelete}>
              <CIcon name="cilXCircle" /> Xóa
            </CButton>
            <CButton type="reset" size="sm" color="danger" onClick={handleBack}>
              <CIcon name="cilChevronRight" /> Trở về
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Edit;
