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
  const [floors, setFloors]       = useState([]);
  const [elevator, setElevator]   = useState([]);
  const [cargolifts, setCargolifts] = useState([]);
  const [year, setYear]           = useState([]);
  const [direction, setDirection] = useState([]);
  useEffect(() => {
    // Type Home
    Axios.get('http://' + window.location.hostname + '/v1/attributes/parents/108')
    .then(res => {
      setType(res.data);
    })
    // Details
    Axios.get('/data/step2.json')
    .then(res => {
      let data = res.data;
      setFloors(data.FloorsOffice);
      setElevator(data.Elevator);
      setCargolifts(data.Cargolifts);
      setYear(data.Year);
      setDirection(data.Direction);
    })
  }, [1]);
  // Errors
  const [error, setError]   = useState('');
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');
  const [error3, setError3] = useState('');

  /* =====> API <===== */
  const [height, setHeight]           = useState('0');
  const [typeValue, setTypeValue]     = useState('13');
  const [floorValue, setFloorValue]   = useState('Tầng');
  const [elevValue, setElevValue]     = useState('Số thang máy');
  const [cargValue, setCargValue]     = useState('Số thang máy');
  const [yearValue, setYearValue]     = useState('Năm');
  const [direcValue2, setDirecValue2] = useState('00');
  // Cookie
  const [ClientId]                    = useCookie('Client');
  const [AccessToken]                 = useCookie('X-Auth-Token');
  const [addressId, setAddressId]     = useCookie('AddressId');
  const [homeId, setHomeId]           = useCookie('HomeId');

  const onSubmit = data => {
    if (floorValue === 'Tầng') {
      setError('Vui lòng chọn số tầng!');
    } else if (elevValue === 'Số thang máy') {
      setError1('Vui lòng chọn số thang máy!');
    } else if (cargValue === 'Số thang máy') {
      setError2('Vui lòng chọn số thang máy');
    } else if (yearValue === 'Năm') {
      setError3('Vui lòng chọn năm');
    } else {
      Axios.post('http://' + window.location.hostname + '/v1/homes',
      {
        'Type': typeValue,
        'Year': yearValue,
        'Length': data.Length,
        'Width': data.Width,
        'Height': height,
        'SiteArea': data.SiteArea,
        'ConstructionArea': data.ConstructionArea,
        'BedRooms': elevValue,
        'BathRooms': cargValue,
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
  }


  return (
    <>
      <CCardBody>
        <CRow>
          <CCol xs="12">
            <h5>Thông tin văn phòng</h5>
          </CCol>
          <CCol xs="12">
            <h6>Diện tích sàn</h6>
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
              <CLabel htmlFor="">Diện tích sử dụng
                {errors.SiteArea?.type === "required" && 
                  <span className="errortext">
                    Vui lòng nhập diện tích sử dụng!
                  </span>
                }
              </CLabel>
              <input
                className="form-control"
                type="number"
                name="SiteArea"
                ref={register({ required: true})}
              />
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Chiều cao từ sàn đến trần</CLabel>
              <input
                className="form-control"
                type="number"
                name="Height"
                onChange={e => setHeight(e.target.value)}
              />
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12">
            <h6>Chi tiết văn phòng</h6>
          </CCol>
          <CCol xs="8">
            <CFormGroup>
              <CLabel htmlFor="">Tên chủ sở hữu
                {errors.OwnerEstate?.type === "required" && 
                  <span className="errortext">
                    Vui lòng nhập tên chủ sở hữu!
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
              <CLabel htmlFor="">Loại tòa nhà</CLabel>
                <CSelect onChange={e => setTypeValue(e.target.value)}>
                  {type.map((d, i) => (
                    <option key={`${d}-${i}`} value={d.AttributeId}>{d.Name}</option>
                  ))}
                </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Số tầng
                <span className="errortext">{error}</span>
              </CLabel>
                <CSelect 
                  onChange={e => setFloorValue(e.target.value)}
                  onClick={e=> setError('')}
                >
                  {floors.map((d, i) => (
                    <option key={`${d}-${i}`}>{d}</option>
                  ))}
                </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Số thang máy khách
                <span className="errortext">{error1}</span>
              </CLabel>
                <CSelect 
                  onChange={e => setElevValue(e.target.value)}
                  onClick={e=> setError1('')}
                >
                  {elevator.map((d, i) => (
                    <option key={`${d}-${i}`}>{d}</option>
                  ))}
                </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Số thang máy chở hàng
                <span className="errortext">{error2}</span>
              </CLabel>
                <CSelect 
                  onChange={e => {setCargValue(e.target.value)}}
                  onClick={e=> setError2('')}
                >
                  {cargolifts.map((d, i) => (
                    <option key={`${d}-${i}`}>{d}</option>
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
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Hướng tòa nhà</CLabel>
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