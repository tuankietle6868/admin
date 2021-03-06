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
  CCardFooter,
  CButton,
  CForm,
  CFormGroup,
  CFormText,
  CLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

function Edit({match}) {

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

    // Go to update
    const handleGo = () => {
      history.push('/groupUpdate/' + Id);
    }

  /* =====> API Edit <===== */
  const [notifi, setNotifi]     = useState('');
  const onSubmit = data => {
    Axios.put('http://' + window.location.hostname + '/v1/groupnames',
    {
      'GroupNameId': Id,
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
      if (typeof(res.data) === 'object') { // Edited
        setOnLoad(true);
        resetForm();
        setNotifi('Ch???nh s???a th??nh c??ng!');
        setTimeout(() => {
          setNotifi('');
        }, 1000);
      }
    })
  }


  return (
    <CRow>
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
            Ch???nh s???a
            <small> Nh??m</small>
          </CCardHeader>
          <CCardBody>
            <CForm action="" method="post" className="form-horizontal">
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-email">T??n nh??m</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <input
                    id="Name"
                    className="form-control"
                    type="text"
                    name="Name" 
                    placeholder="T??n nh??m..."
                    ref={register({ required: true })}  
                  />
                  {errors.Name ?.type === "required" &&
                    <CFormText className="help-block">
                      Nh???p t??n cho nh??m n??y!
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
                      Nh???p m?? t??? cho nh??m n??y!
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
            <CButton type="reset" size="sm" color="danger">
              <CIcon name="cilX" /> H???y
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
            Permission Id: {match.params.GroupNameId}
            <span style={{ float: "right", color: "#bd0000"}}>{notifi}</span>
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
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" onClick={handleGo}> 
              <CIcon name="cilSettings" /> C???p nh???t quy???n
            </CButton>
            <CButton type="submit" size="sm" color="primary">
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
