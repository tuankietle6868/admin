import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { ReactReduxContext } from 'react-redux';
import { Load } from '../../../reducers/approval';
import { useCookie } from '@use-hook/use-cookie';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CButton,
  CCardFooter,
  CForm,
  CFormGroup,
  CLabel,
  CSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react';

const useDispatch = () => {
  const { store } = React.useContext(ReactReduxContext);
  return store.dispatch;
}

function Add() {

  const dispatch = useDispatch();
  const handleLoad = () => {
    console.log('abc');
    dispatch(Load());
  }

  /* =====> Cookie <===== */
  const [ClientId]    = useCookie('Client');
  const [AccessToken] = useCookie('X-Auth-Token');

  /* =====> API Get Group, User, Province, District, Ward <===== */
  const [groups, setGroups]       = useState([]);
  const [users, setUsers]         = useState([]);
  const [province, setProvince]   = useState([]);
  const [districts, setDistricts] = useState([]);
  const [provValue, setProvValue] = useState('00');
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/groupnames')
    .then(res => {
      setGroups(res.data);
    })
    Axios.get('http://' + window.location.hostname + '/v1/users/getallusers')
    .then(res => {
      setUsers(res.data);
    })
    Axios.get('http://' + window.location.hostname + '/v1/address/provinces')
    .then(res => {
      setProvince(res.data);
    })
    if (provValue !== '00') {
      Axios.get('http://' + window.location.hostname + '/v1/address/districts/' + provValue)
      .then(res => {
        setDistricts(res.data);
      })
    }
  }, [1, provValue]);

  /* =====> Check Condition <===== */
  const [groupValue, setGroupValue] = useState('00');
  const [userValue, setUserValue]   = useState('00');
  const [distValue, setDistValue]   = useState('00');
  const [disGroup, setDisGroup]     = useState(false);
  const [disUser, setDisUser]       = useState(false);
  const [disProv, setDisProv]       = useState(false);
  useEffect(() => {
    if (groupValue !== '00') {
      setDisUser(true);
    } else {
      setDisUser(false);
    }
    if (userValue !== '00') {
      setDisGroup(true);
    } else {
      setDisGroup(false);
    }
    if (distValue !== '00') {
      setDisProv(true);
      setProvValue('00');
    } else {
      setDisProv(false)
    }
  }, [groupValue, userValue, distValue]);


  /* =====> API Post Approval <===== */
  const [nofiti, setNofiti] = useState('');
  const onSubmit = () => {
    if ((groupValue !== '00' || userValue !== '00') && (provValue !== '00' || distValue !== '00')) { //Eligible
      Axios.post('http://' + window.location.hostname + '/v1/approvalmanager',
      {
        'ProvinceId': provValue,
        'DistrictId': distValue,
        'WardId': '0',
        'UserId': userValue,
        'GroupNameId': groupValue
      },
      {headers:
        {
          'Client': ClientId,
          'X-Auth-Token':  AccessToken
        }
      })
      .then(res => {
        if (typeof(res.data) === 'object') { // Edited
          setNofiti('Th??m th??nh c??ng!');
          setTimeout(() => {
            setNofiti('');
          }, 1000);
        }
      })
    } else if (groupValue !== '00' || userValue !== '00') { // Unqualified
      setNofiti('Vui l??ng ch???n khu v???c');
    } else if (provValue !== '00' || distValue !== '00') { // Unqualified
      setNofiti('Vui l??ng ch???n nh??m ho???c ng?????i qu???n l??');
    } else { // Unqualified
      setNofiti('Vui l??ng ch???n th??ng tin!');
    }
  }


  return (
    <CCol xs="12" md="6">
      <CCard>
        <CCardHeader>
          Th??m
          <small> Khu v???c</small>
          <span style={{ float: "right", color: "#bd0000"}}>{nofiti}</span>
        </CCardHeader>
        <CCardBody>
          <CForm action="" method="post" className="form-horizontal">
            <CFormGroup row>
              <CCol md="3">
                <CLabel htmlFor="hf-email">Nh??m</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect disabled={disGroup} onChange={e => setGroupValue(e.target.value)} onClick={e => setNofiti("")}>
                  <option value="00">Nh??m</option>
                  {groups.map((d, i) => (
                    <option value={d.GroupNameId} key={`${d}-${i}`}>{`${d.GroupNameName} (ID: ${d.GroupNameId})`}</option>
                  ))}
                </CSelect>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="3">
                <CLabel htmlFor="Description">Ng?????i d??ng</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect disabled={disUser} onChange={e => setUserValue(e.target.value)} onClick={e => setNofiti("")}>
                  <option value="00">Ng?????i d??ng</option>
                  {users.map((d, i) => (
                    <option value={d.UserId} key={`${d}-${i}`}>{`${d.Name} (ID: ${d.UserId})`}</option>
                  ))}
                </CSelect>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="3">
                <CLabel htmlFor="Description">T???nh th??nh ph???</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect disabled={disProv} onChange={e => setProvValue(e.target.value)} onClick={e => setNofiti("")}>
                  <option value="00">T???nh th??nh ph???</option>
                  {province.map((d, i) => (
                    <option value={d.ProvinceId} key={`${d}-${i}`}>{`${d.Name} (ID: ${d.ProvinceId})`}</option>
                  ))}
                </CSelect>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="3">
                <CLabel htmlFor="Description">Qu???n huy???n</CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CSelect onChange={e => setDistValue(e.target.value)} onClick={e => setNofiti("")}>
                  <option value="00">Qu???n huy???n</option>
                  {districts.map((d, i) => (
                    <option value={d.DistrictId} key={`${d}-${i}`}>{`${d.Name} (ID: ${d.DistrictId})`}</option>
                  ))}
                </CSelect>
              </CCol>
            </CFormGroup>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CButton type="submit" size="sm" color="primary" onClick={onSubmit}>
            <CIcon name="cilTask" /> Th??m
          </CButton>
          <CButton type="reset" size="sm" color="danger">
            <CIcon name="cilX" /> H???y
          </CButton>
        </CCardFooter>
      </CCard>
    </CCol>
  );
}

export default Add; 
