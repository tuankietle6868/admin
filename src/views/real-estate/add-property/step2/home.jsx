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
  // Errors
  const [error, setError]   = useState('');
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');
  const [error3, setError3] = useState('');

  /* =====> API <===== */
  const [height, setHeight]           = useState('0');
  const [roadValue, setRoadValue]     = useState('Đường hẻm lớn')
  const [typeValue, setTypeValue]     = useState('13');
  const [floorValue, setFloorValue]   = useState('Tầng');
  const [bedValue, setBedValue]       = useState('Phòng ngủ');
  const [bathValue, setBathValue]     = useState('Phòng tắm');
  const [yearValue, setYearValue]     = useState('Năm');
  const [direcValue1, setDirecValue1] = useState('00');
  const [direcValue2, setDirecValue2] = useState('00');
  // Cookie
  const [ClientId]                    = useCookie('Client');
  const [AccessToken]                 = useCookie('X-Auth-Token');
  const [addressId, setAddressId]     = useCookie('AddressId');
  const [homeId, setHomeId]           = useCookie('HomeId');

  const onSubmit = data => {
    if (floorValue === 'Tầng') {
      setError('Vui lòng chọn số tầng!');
    } else if (bedValue === 'Phòng ngủ') {
      setError1('Vui lòng chọn phòng ngủ!');
    } else if (bathValue === 'Phòng tắm') {
      setError2('Vui lòng chọn phòng tắm');
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
        'BedRooms': bedValue,
        'BathRooms': bathValue,
        'Floors': floorValue,
        'Road': roadValue,
        'Direction': direcValue2,
        'DirectionBalcony': direcValue1,
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
            <h5>Thông tin căn nhà</h5>
          </CCol>
          <CCol xs="12">
            <h6>Diện tích xây dựng</h6>
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
              <CLabel htmlFor="">Diện tích sàn
                {errors.SiteArea?.type === "required" && 
                  <span className="errortext">
                    Vui lòng nhập diện tích sàn!
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
            <h6>Chi tiết căn nhà</h6>
          </CCol>
          <CCol xs="8">
            <CFormGroup>
              <CLabel htmlFor="">Tên chủ nhà
                {errors.OwnerEstate?.type === "required" && 
                  <span className="errortext">
                    Vui lòng nhập tên chủ nhà!
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
              <CLabel htmlFor="">Loại nhà</CLabel>
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
              <CLabel htmlFor="">Số phòng ngủ
                <span className="errortext">{error1}</span>
              </CLabel>
                <CSelect 
                  onChange={e => setBedValue(e.target.value)}
                  onClick={e=> setError1('')}
                >
                  {bedrooms.map((d, i) => (
                    <option key={`${d}-${i}`}>{d}</option>
                  ))}
                </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Số phòng tắm
                <span className="errortext">{error2}</span>
              </CLabel>
                <CSelect 
                  onChange={e => {setBathValue(e.target.value)}}
                  onClick={e=> setError2('')}
                >
                  {bathrooms.map((d, i) => (
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
              <CLabel htmlFor="">Hướng ban công</CLabel>
              <CSelect onChange={e => {setDirecValue1(e.target.value)}}>
                {direction.map((d, i) => (
                  <option key={`${d}-${i}`} value={d.Location}>{d.Name}</option>
                ))}
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">Hướng nhà</CLabel>
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