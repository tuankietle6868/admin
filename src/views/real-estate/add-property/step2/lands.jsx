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
  const [direction, setDirection] = useState([]);
  useEffect(() => {
    // Type Home
    Axios.get('http://' + window.location.hostname + '/v1/attributes/parents/103')
    .then(res => {
      setType(res.data);
    })
    // Details
    Axios.get('/data/step2.json')
    .then(res => {
      setDirection(res.data.Direction);
    })
  }, [1]);

  /* =====> API <===== */
  const [typeValue, setTypeValue]     = useState('00');
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
      'Year': '00',
      'Length': data.Length,
      'Width': data.Width,
      'Height': '00',
      'SiteArea': '00',
      'ConstructionArea': data.ConstructionArea,
      'BedRooms': '00',
      'BathRooms': '00',
      'Floors': '00',
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
        alert('Kh??ng th??nh c??ng!');
      }
    })
  }


  return (
    <>
      <CCardBody>
        <CRow>
          <CCol xs="12">
            <h5>Th??ng tin ?????t</h5>
          </CCol>
          <CCol xs="12">
            <h6>Di???n t??ch ?????t</h6>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">R???ng
                {errors.Width?.type === "required" && 
                  <span className="errortext">
                    Vui l??ng nh???p chi???u r???ng!
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
              <CLabel htmlFor="">D??i
                {errors.Length?.type === "required" && 
                  <span className="errortext">
                    Vui l??ng nh???p chi???u d??i!
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
              <CLabel htmlFor="">T???ng
                {errors.ConstructionArea?.type === "required" && 
                  <span className="errortext">
                    Vui l??ng nh???p di???n t??ch!
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
            <h6>Chi ti???t ?????t</h6>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">T??n ch??? ?????t
                {errors.OwnerEstate?.type === "required" && 
                  <span className="errortext">
                    Vui l??ng nh???p t??n ch??? ?????t!
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
              <CLabel htmlFor="">Lo???i ?????t</CLabel>
                <CSelect onChange={e => setTypeValue(e.target.value)}>
                  {type.map((d, i) => (
                    <option key={`${d}-${i}`} value={d.AttributeId}>{d.Name}</option>
                  ))}
                </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="4">
            <CFormGroup>
              <CLabel htmlFor="">H?????ng ?????t</CLabel>
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
          <CIcon name="cil-scrubber" /> Ti???p theo
        </CButton>
        <CButton type="submit" size="sm" color="danger" onClick={onPrevious}>
          <CIcon name="cil-ban" /> Tr??? v???
        </CButton>
      </CCardFooter>
    </>
  );
}

export default withRouter(Step1);