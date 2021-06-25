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
  const [floors, setFloors]       = useState([]);
  const [bedrooms, setBedrooms]   = useState([]);
  const [bathrooms, setBathrooms] = useState([]);
  const [year, setYear]           = useState([]);
  const [direction, setDirection] = useState([]);
  useEffect(() => {
    // Type Home
    Axios.get('http://' + window.location.hostname + '/v1/attributes/parents/100')
    .then(res => {
      setType(res.data);
    })
    // Details
    Axios.get('/data/step2.json')
    .then(res => {
      let data = res.data;
      setRoad(data.Road);
      setFloors(data.Floors);
      setBedrooms(data.BedRooms);
      setBathrooms(data.BathRooms);
      setYear(data.Year);
      setDirection(data.Direction);
    })
  }, [1]);

  /* =====> API <===== */
  const [typeValue, setTypeValue]     = useState('13');
  const [floorValue, setFloorValue]   = useState('Tầng');
  const [yearValue, setYearValue]     = useState('Năm');
  const [direcValue2, setDirecValue2] = useState('00');
  // Cookie
  const [ClientId]                    = useCookie('Client');
  const [AccessToken]                 = useCookie('X-Auth-Token');
  const [addressId, setAddressId]     = useCookie('AddressId');
  const [homeId, setHomeId]           = useCookie('HomeId');

  const onSubmit = data => {
    Axios.post('http://' + window.location.hostname + '/v1/homes',
    {
      'Type': typeValue,
      'Year': yearValue,
      'Length': data.Length,
      'Width': data.Width,
      'Height': '00',
      'SiteArea': '00',
      'ConstructionArea': data.ConstructionArea,
      'BedRooms': '00',
      'BathRooms': '00',
      'Floors': floorValue,
      'Road': '00',
      'Direction': direcValue2,
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


  return (
    <>
      <CCardBody>
        <CRow>
          <CCol xs="12">
            <h5>Thông tin nhà xưởng</h5>
          </CCol>
          <CCol xs="12">
            <h6>Diện tích nhà xưởng</h6>
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
        </CRow>
        <CRow>
          <CCol xs="12">
            <h6>Chi tiết nhà xưởng</h6>
          </CCol>
          <CCol xs="8">
            <CFormGroup>
              <CLabel htmlFor="">Tên chủ xưởng
                {errors.OwnerEstate?.type === "required" && 
                  <span className="errortext">
                    Vui lòng nhập tên chủ xưởng!
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
              <CLabel htmlFor="">Loại</CLabel>
                <CSelect onChange={e => setTypeValue(e.target.value)}>
                  <option value="00">Nhà xưởng</option>
                </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Số tầng</CLabel>
                <CSelect onChange={e => setFloorValue(e.target.value)}>
                  {floors.map((d, i) => (
                    <option key={`${d}-${i}`}>{d}</option>
                  ))}
                </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Năm xây dựng</CLabel>
              <CSelect onChange={e => setYearValue(e.target.value)}>
                {year.map((d, i) => (
                  <option key={`${d}-${i}`}>{d}</option>
                ))}
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Hướng xưởng</CLabel>
              <CSelect onChange={e => {setDirecValue2(e.target.value)}}>
                {direction.map((d, i) => (
                  <option key={`${d}-${i}`} value={d.Location}>{d.Name}</option>
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