import React, { useState, useEffect } from 'react';
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
  const onPrevious = () => {
    props.history.push('/');
  }
  /* =====> DOM <===== */
  const [type, setType]           = useState([]);
  const [road, setRoad]           = useState([]);
  const [year, setYear]           = useState([]);
  useEffect(() => {
    // Type Home
    Axios.get('http://' + window.location.hostname + '/v1/attributes/parents/107')
    .then(res => {
      setType(res.data);
    })
    // Details
    Axios.get('/data/step2.json')
    .then(res => {
      let data = res.data;
      setRoad(data.Road);
      setYear(data.Year);
    })
  }, [1]);
  // Errors
  const [error3, setError3] = useState('');

  /* =====> API <===== */
  const [height, setHeight]           = useState('0');
  const [siteArea, setSiteArea]       = useState('00');
  const [roadValue, setRoadValue]     = useState('Đường hẻm lớn')
  const [typeValue, setTypeValue]     = useState('13');
  const [yearValue, setYearValue]     = useState('Năm');
  // Cookie
  const [ClientId]                    = useCookie('Client');
  const [AccessToken]                 = useCookie('X-Auth-Token');
  const [addressId, setAddressId]     = useCookie('AddressId');
  const [homeId, setHomeId]           = useCookie('HomeId');

  const onSubmit = data => {
    if (yearValue === 'Năm') {
      setError3('Vui lòng chọn năm');
    } else {
      Axios.post('http://' + window.location.hostname + '/v1/homes',
      {
        'Type': typeValue,
        'Year': yearValue,
        'Length': data.Length,
        'Width': data.Width,
        'Height': height,
        'SiteArea': siteArea,
        'ConstructionArea': data.ConstructionArea,
        'BedRooms': '00',
        'BathRooms': '00',
        'Floors': '00',
        'Road': roadValue,
        'Direction': '00',
        'DirectionBalcony': '00',
        'AddressId': addressId,
        'Owner': data.OwnerEstate
      },
      {headers:
        {
          'Client': ClientId,
          'X-Auth-Token': AccessToken
        }
      })
      .then(res => {
        if ( typeof(res.data) === 'object' ){
          setHomeId(res.data.HomeId);
          props.history.push('/step3');
          setAddressId('', { expires: 0 });
        } else {
          alert('Không thành công!');
        }
      })
    }
  }


  return (
    <>
      <CCardBody>
        <CRow>
          <CCol xs="12">
            <h5>Thông tin phòng trọ</h5>
          </CCol>
          <CCol xs="12">
            <h6>Diện tích phòng</h6>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Rộng
                {errors.Width?.type === "required" && 
                  <span className="errortext">
                    Vui lòng nhập chiều rộng!
                  </span>
                }
              </CLabel>
              <input
                className="form-control"
                type="number"
                name="Width"
                ref={register({ required: true})}
              />
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Dài
                {errors.Length?.type === "required" && 
                  <span className="errortext">
                    Vui lòng nhập chiều dài!
                  </span>
                }
              </CLabel>
              <input
                className="form-control"
                type="number"
                name="Length"
                ref={register({ required: true})}
              />
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Tổng
                {errors.ConstructionArea?.type === "required" && 
                  <span className="errortext">
                    Vui lòng nhập diện tích!
                  </span>
                }
              </CLabel>
              <input
                className="form-control"
                type="number"
                name="ConstructionArea"
                ref={register({ required: true})}
              />
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Diện tích gác</CLabel>
              <input
                className="form-control"
                type="number"
                name="SiteArea"
                onChange={e => setSiteArea(e.targer.value)}  
              />
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Chiều cao phòng</CLabel>
              <input
                className="form-control"
                type="number"
                name="Height"
                onChange={e => setHeight(e.target.value)}
              />
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Loại đường</CLabel>
                <CSelect onChange={e => setRoadValue(e.target.value)}>
                  {road.map((d, i) => (
                    <option key={`${d}-${i}`}>{d}</option>
                  ))}
                </CSelect>
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12">
            <h6>Chi tiết phòng trọ</h6>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Tên chủ trọ
                {errors.OwnerEstate?.type === "required" && 
                  <span className="errortext">
                    Vui lòng nhập tên chủ trọ!
                  </span>
                }
              </CLabel>
              <input 
                className="form-control"
                type="text"
                name="OwnerEstate"
                ref={register({ required: true})}
              />
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Loại phòng</CLabel>
                <CSelect onChange={e => setTypeValue(e.target.value)}>
                  {type.map((d, i) => (
                    <option key={`${d}-${i}`} value={d.AttributeId}>{d.Name}</option>
                  ))}
                </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Năm xây dựng
                <span className="errortext">{error3}</span>
              </CLabel>
              <CSelect 
                onChange={e => setYearValue(e.target.value)}
                onClick={e=> setError3('')}
              >
                {year.map((d, i) => (
                  <option key={`${d}-${i}`}>{d}</option>
                ))}
              </CSelect>
            </CFormGroup>
          </CCol>
        </CRow>
      </CCardBody>   
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" onClick={handleSubmit(onSubmit)}>
          <CIcon name="cil-scrubber" /> Tiếp theo
        </CButton>
        <CButton type="submit" size="sm" color="danger" onClick={onPrevious}>
          <CIcon name="cil-ban" /> Trở về
        </CButton>
      </CCardFooter>
    </>
  );
}

export default withRouter(Step1);