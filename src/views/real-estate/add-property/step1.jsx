import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useForm } from "react-hook-form";
import { useCookie } from '@use-hook/use-cookie';
import { withRouter } from "react-router-dom";
import {
  CButton,
  CCardBody,
  CCardFooter,
  CCol,
  CFormGroup,
  CLabel,
  CSelect,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

function Step1(props) {

  const { register, errors, handleSubmit } = useForm(); 
  const [ClientId]                = useCookie('Client');
  const [AccessToken]             = useCookie('X-Auth-Token');
  const [addressId, setAddressId] = useCookie('AddressId');

  const [provice, setProvince]          = useState([]);

  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/address/provinces')
    .then(res => {
      setProvince(res.data);
    })
  }, [1]);

  const [provValue, setProvValue]       = useState('00');
  const [district, setDistrict]         = useState([]);
  useEffect(() => {
    if( provValue !== '00' ) {
      Axios.get('http://' + window.location.hostname + '/v1/address/districts/' + provValue)
      .then(res => {
        setDistrict(res.data);
      })
    }
  }, [provValue]);

  const [distValue, setDistValue] = useState('00');
  const [ward, setWard]           = useState([]);
  useEffect(() => {
    if( distValue !== '00' ) {
      Axios.get('http://' + window.location.hostname + '/v1/address/wards/' + distValue)
      .then(res => {
        setWard(res.data);
      })
    }
  }, [distValue]);

  const [type, setType] = useState('Home');
  const [wardValue, setWardValue] = useState('00');
  const [errorProv, setErrorProv] = useState(false);
  const [errorDist, setErrorDist] = useState(false);
  const [errorWard, setErrorWard] = useState(false);

  const onSubmit = data => {
    props.history.push('/step3');
    if (provValue === '00') {
      setErrorProv(true);
    } else if (distValue === '00') {
      setErrorDist(true);
    } else if (wardValue === '00') {
      setErrorWard(true);
    } else {
      Axios.post('http://' + window.location.hostname + '/v1/address',
      {
        'Detail': data.Numberhouse + ' ' + data.Street,
        'WardId': wardValue,
        'DistrictId': distValue,
        'ProvinceId': provValue
      },
      {headers: 
        {
          'Client': ClientId,
          'X-Auth-Token': AccessToken
        }
      })
      .then(res => {
        if (typeof(res.data) === 'object') {
          setAddressId(res.data.AddressId)
          if (type === 'Home' ) {
            props.history.push('/step2home');
          } else if (type === 'Apartment') {
            props.history.push('/step2apartment');
          } else if (type === 'Villa') {
            props.history.push('/step2villa');
          } else if (type === 'Officetel') {
            props.history.push('/step2officetel');
          } else if (type === 'Lands') {
            props.history.push('/step2lands');
          } else if (type === 'Factory') {
            props.history.push('/step2factory');
          } else {
            props.history.push('/step2motel');
          }
        }
      })
    }
  }


  return (
    <>
      <CCardBody>
        <CRow>
          <CCol xs="12" sm="8">
            <h5> Nh???p ?????a ch???</h5>
          </CCol>
          <CCol xs="12" sm="4" className="float-right">
            <CFormGroup>
              <CLabel htmlFor="">Lo???i h??nh b???t ?????ng s???n</CLabel>
              <CSelect custom onChange={e =>
                setType(e.target.value)}>
                <option value="Home">Nh??</option>
                <option value="Apartment">C??n h???</option>
                <option value="Villa">Bi???t th???</option>
                <option value="Officetel">V??n Ph??ng</option>
                <option value="Lands">?????t</option>
                <option value="Factory">Nh?? x?????ng</option>
                <option value="Motel">Ph??ng tr???</option>
              </CSelect>
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">T???nh th??nh
                <span className="errortext" style={{ display: errorProv? "block" : "none"}}>
                  Vui l??ng ch???n t???nh th??nh!
                </span>
              </CLabel>
              <CSelect custom onChange={e => setProvValue(e.target.value)}>
                <option value="00">T???nh th??nh</option>
                {provice.map((d, i) => (
                  <option key={`${d}-${i}`} value={d.ProvinceId}>{d.Name}</option>
                ))}
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Qu???n huy???n
                <span className="errortext" style={{ display: errorDist? "block" : "none"}}>
                  Vui l??ng ch???n qu???n huy???n!
                </span>
              </CLabel>
              <CSelect custom onChange={e => setDistValue(e.target.value)}>
                <option value="00">Qu???n huy???n</option>
                {district.map((d, i) => (
                  <option key={`${d}-${i}`} value={d.DistrictId}>{d.Name}</option>
                ))}
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Ph?????ng x?? 
                <span className="errortext" style={{ display: errorWard? "block" : "none"}}>
                  Vui l??ng ch???n x?? ph?????ng!
                </span>
              </CLabel>
              <CSelect custom onChange={e => setWardValue(e.target.value)}>
                <option value="00">Ph?????ng x?? </option>
                {ward.map((d, i) => (
                  <option key={`${d}-${i}`} value={d.DistrictId}>{d.Name}</option>
                ))}
              </CSelect>
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">S??? nh?? 
                {errors.Numberhouse?.type === "required" && 
                  <span className="errortext" style={{ color: "#bd0000"}}>
                    Vui l??ng nh???p s??? nh??!
                  </span>
                }
              </CLabel>
              <input 
                className="form-control"
                type="text"
                name="Numberhouse" 
                placeholder="Nh???p s??? nh??" 
                ref={register({ required: true })}
              />
            </CFormGroup>
          </CCol>
          <CCol xs="8">
            <CFormGroup>
              <CLabel htmlFor="">T??n ???????ng
                {errors.Street?.type === "required" && 
                  <span className="errortext" style={{ color: "#bd0000"}}>
                    Vui l??ng nh???p t??n ???????ng!
                  </span>
                }
              </CLabel>
              <input 
                className="form-control"
                type="text"
                name="Street" 
                placeholder="Nh???p t??n ???????ng" 
                ref={register({ required: true })}
              />
            </CFormGroup>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" onClick={handleSubmit(onSubmit)}>
          <CIcon name="cilChevronRight" /> Ti???p theo
        </CButton>
      </CCardFooter>
    </>
  )
}

export default withRouter(Step1);
