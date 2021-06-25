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
            <h5> Nhập địa chỉ</h5>
          </CCol>
          <CCol xs="12" sm="4" className="float-right">
            <CFormGroup>
              <CLabel htmlFor="">Loại hình bất động sản</CLabel>
              <CSelect custom onChange={e =>
                setType(e.target.value)}>
                <option value="Home">Nhà</option>
                <option value="Apartment">Căn hộ</option>
                <option value="Villa">Biệt thự</option>
                <option value="Officetel">Văn Phòng</option>
                <option value="Lands">Đất</option>
                <option value="Factory">Nhà xưởng</option>
                <option value="Motel">Phòng trọ</option>
              </CSelect>
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Tỉnh thành
                <span className="errortext" style={{ display: errorProv? "block" : "none"}}>
                  Vui lòng chọn tỉnh thành!
                </span>
              </CLabel>
              <CSelect custom onChange={e => setProvValue(e.target.value)}>
                <option value="00">Tỉnh thành</option>
                {provice.map((d, i) => (
                  <option key={`${d}-${i}`} value={d.ProvinceId}>{d.Name}</option>
                ))}
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Quận huyện
                <span className="errortext" style={{ display: errorDist? "block" : "none"}}>
                  Vui lòng chọn quận huyện!
                </span>
              </CLabel>
              <CSelect custom onChange={e => setDistValue(e.target.value)}>
                <option value="00">Quận huyện</option>
                {district.map((d, i) => (
                  <option key={`${d}-${i}`} value={d.DistrictId}>{d.Name}</option>
                ))}
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Phường xã 
                <span className="errortext" style={{ display: errorWard? "block" : "none"}}>
                  Vui lòng chọn xã phường!
                </span>
              </CLabel>
              <CSelect custom onChange={e => setWardValue(e.target.value)}>
                <option value="00">Phường xã </option>
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
              <CLabel htmlFor="">Số nhà 
                {errors.Numberhouse?.type === "required" && 
                  <span className="errortext" style={{ color: "#bd0000"}}>
                    Vui lòng nhập số nhà!
                  </span>
                }
              </CLabel>
              <input 
                className="form-control"
                type="text"
                name="Numberhouse" 
                placeholder="Nhập số nhà" 
                ref={register({ required: true })}
              />
            </CFormGroup>
          </CCol>
          <CCol xs="8">
            <CFormGroup>
              <CLabel htmlFor="">Tên đường
                {errors.Street?.type === "required" && 
                  <span className="errortext" style={{ color: "#bd0000"}}>
                    Vui lòng nhập tên đường!
                  </span>
                }
              </CLabel>
              <input 
                className="form-control"
                type="text"
                name="Street" 
                placeholder="Nhập tên đường" 
                ref={register({ required: true })}
              />
            </CFormGroup>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" onClick={handleSubmit(onSubmit)}>
          <CIcon name="cilChevronRight" /> Tiếp theo
        </CButton>
      </CCardFooter>
    </>
  )
}

export default withRouter(Step1);
