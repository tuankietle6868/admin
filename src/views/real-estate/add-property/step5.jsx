import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import NumberFormat from 'react-number-format';
import { useForm } from 'react-hook-form';
import { useCookie } from '@use-hook/use-cookie';
import { withRouter } from 'react-router-dom';
import {
  CButton,
  CCardBody,
  CCardFooter,
  CCol,
  CFormGroup,
  CLabel,
  CSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react';



function Step1(props) {

  const { register, errors, handleSubmit, watch } = useForm();
  const watchValue = watch();

  const onPrevious = () => {
    props.history.push('/step4');
  }

  const [sell, setSell] = useState([]);
  useEffect(() => {
    Axios.get('/data/step5.json')
    .then(res => {
      setSell(res.data.Sell);
    })
  }, [1]);

  const [ClientId]          = useCookie('Client');
  const [AccessToken]       = useCookie('X-Auth-Token');
  const [homeId, setHomeId] = useCookie('HomeId');

  const [sellUnit, setSellUnit] = useState('Đồng lô');
  const onSubmit = data => {
    Axios.post('http://' + window.location.hostname + '/v1/sell',
    {
      'Price': data.Price,
      'HomeId': homeId
    },
    {headers: 
      {
        'Client': ClientId,
        'X-Auth-Token': AccessToken
      }
    })
    .then(res => {
      if ( typeof(res.data) === 'object' ) {
        setHomeId('', { expires: 0 });
        window.location.href = '/';
        alert('Đăng tin thành công');
      } else {
        alert('Đăng tin chưa thành công');
      }
    })
  }

  return (
    <>
      <CCardBody>
        <CFormGroup row>
          <CCol md="12">
            <CLabel>Giá</CLabel>
          </CCol>
        </CFormGroup>
        <CFormGroup row>
          <CCol md="4">
            <CLabel>Đơn vị</CLabel>
            <CSelect onChange={e => setSellUnit(e.target.value)}>
              {sell.map((d, i) => (
                <option key={`${d}-${i}`}>{d}</option>
              ))}
            </CSelect>
          </CCol>
          <CCol md="4">
            <CLabel>Giá
              {errors.Price?.type === "required" &&
                <span className="errortext">Vui lòng nhập giá</span>
              }
              {errors.Price?.type === "maxLength" &&
                <span className="errortext">Không nhập lớn hơn 9 ký tự</span>
              }
            </CLabel>
            <input
              className="form-control" 
              type="number"
              name="Price"
              ref={register({ required: true, maxLength: 9 })}
            />
          </CCol>
          <CCol md="4">
            <CLabel>Tổng</CLabel>
            <NumberFormat
              className="form-control"
              value={watchValue.Price} 
              thousandSeparator={'.'} 
              decimalSeparator={','}
              suffix={sellUnit}
              // disabled={true}
            />
          </CCol>
        </CFormGroup>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" onClick={handleSubmit(onSubmit)}>
          <CIcon name="cil-scrubber" /> Đăng tin
        </CButton>
        <CButton type="reset" size="sm" color="danger" onClick={onPrevious}>
          <CIcon name="cil-ban" /> Trở về
        </CButton>
      </CCardFooter>
    </>
  )
}

export default withRouter(Step1);
