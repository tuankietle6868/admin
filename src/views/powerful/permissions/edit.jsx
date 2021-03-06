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
        setNotifi('Ch???nh s???a th??nh c??ng!');
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
            Ch???nh s???a
            <small> Quy???n</small>
          </CCardHeader>
          <CCardBody>
            <CForm action="" method="post" className="form-horizontal">
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-email">C??c lo???i quy???n</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <input
                    id="Name"
                    className="form-control"
                    type="text"
                    name="Name" 
                    placeholder="T??n quy???n..."
                    ref={register({ required: true })}  
                  />
                  {errors.Name ?.type === "required" &&
                    <CFormText className="help-block">
                      Nh???p t??n cho nh??m quy???n n??y!
                    </CFormText>
                  }
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="Description">M?? t???</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <input
                    id="Description"
                    className="form-control"
                    type="text"
                    name="Description" 
                    placeholder="M?? t???..."
                    ref={register({ required: true })}  
                  />
                  {errors.Description ?.type === "required" &&
                    <CFormText className="help-block">
                      Nh???p m?? t??? cho quy???n n??y!
                    </CFormText>
                  }
                </CCol>
              </CFormGroup>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" onClick={handleSubmit(onSubmit)}>
              <CIcon name="cilTask" /> ?????ng ??
            </CButton>
            <CButton type="reset" size="sm" color="danger" onClick={e => setOpenEdit(false)}>
              <CIcon name="cilX" /> H???y
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
              <CIcon name="cilSettings" /> Ch???nh s???a
            </CButton>
            <CButton type="submit" size="sm" color="primary" onClick={handleDelete}>
              <CIcon name="cilXCircle" /> X??a
            </CButton>
            <CButton type="reset" size="sm" color="danger" onClick={handleBack}>
              <CIcon name="cilChevronRight" /> Tr??? v???
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Edit;
