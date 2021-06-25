import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import {
  CButton,
  CCardBody,
  CCardFooter,
  CCol,
  CFormGroup,
  CInput,
  CInputRadio,
  CLabel,
  CRow,
  CSwitch
} from '@coreui/react'
import CIcon from '@coreui/icons-react';


function Step1(props) {

  const onPrevious = () => {
    props.history.push('/step3');
  }

  const [Image, setImage]       = useState({ preview: '', raw: '' });
  const [Image1, setImage1]     = useState({ preview: '', raw: '' });
  const handleIMG = e => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };
  const handleIMG1 = e => {
    if (e.target.files.length) {
      setImage1({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  };

  const [lands, setLands] = useState(true);
  const handleChange = () => {
    if (lands) {
      setLands(false);
    } else {
      setLands(true);
    }
  }

  const [infrastructure, setInfrastructure] = useState([]);
  const [utility, setUtility]               = useState([]);

  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/attributes/parents/38')
    .then(response => {
      setInfrastructure(response.data);
    })
    Axios.get('http://' + window.location.hostname + '/v1/attributes/parents/45')
    .then(response => {
      setUtility(response.data);
    })
  }, [1]);


  return (
    <>
      <CCardBody>
          <CCol xs="12">
            <CFormGroup row>
              <h5>Sổ hồng</h5>
              <CSwitch className={'mx-1'} onChange={handleChange} shape={'pill'} color={'danger'} labelOn={'\u2713'} labelOff={'\u2715'} defaultChecked />
            </CFormGroup>
          </CCol>
          <div className="lands" style={{ height: lands? "400px" : "0"}}>
            <div className="imgage">
              <h6>Hình ảnh sổ</h6>
              <CFormGroup row>
                <CCol md="4">
                  <div className="upload">
                    {Image.preview ? (
                      <>
                        <span className="close" onClick={e => setImage('')}>&times;</span>
                        <img src={Image.preview} alt="sổ hồng" />
                        <input className="input-upload" type="file" onChange={handleIMG} />
                      </>
                    ) : (
                      <>
                        <label className="title-img">Mặt trước</label>
                        <input className="input-upload" type="file" onChange={handleIMG} />
                      </>
                    )}
                  </div>
                </CCol>
                <CCol md="4">
                <div className="upload">
                    {Image1.preview ? (
                      <>
                        <span className="close" onClick={e => setImage1('')}>&times;</span>
                        <img src={Image1.preview} alt="sổ hồng" />
                        <input className="input-upload" type="file" onChange={handleIMG1} />
                      </>
                    ) : (
                      <>
                        <label className="title-img">Mặt sau</label>
                        <input className="input-upload" type="file" onChange={handleIMG1} />
                      </>
                    )}
                  </div>
                </CCol>
              </CFormGroup>
            </div>
            <CFormGroup row>
              <CCol md="6">
                <CLabel>Tên chủ sở hữu</CLabel>
                <CInput />
              </CCol>
              <CCol md="3">
                <CLabel>Thửa đất số</CLabel>
                <CInput type="number" />
              </CCol>
              <CCol md="3">
                <CLabel>Tờ bản đồ số</CLabel>
                <CInput type="number" />
              </CCol>
            </CFormGroup>
            <CFormGroup>
              <CLabel>Diện tích đất</CLabel>
              <CRow>
                <CCol md="3">
                  <CLabel>Rộng</CLabel>
                  <CInput type="number" />
                </CCol>
                <CCol md="3">
                  <CLabel>Dài</CLabel>
                  <CInput type="number" />
                </CCol>
                <CCol md="3">
                  <CLabel>Tổng</CLabel>
                  <CInput type="number" />
                </CCol>
                <CCol md="3">
                  <CLabel>Thời hạn sử dụng đất</CLabel>
                  <CInput type="date" />
                </CCol>
              </CRow>
            </CFormGroup>
            <hr />
          </div>
          <CFormGroup row>
            <CCol md="12">
              <CLabel><b>Cơ sở hạ tầng</b></CLabel>
            </CCol>
            {infrastructure.map((d, i) => (
              <CCol md="3" key={`${d}-${i}`}>
                <CFormGroup variant="custom-radio" inline>
                  <CInputRadio custom id={d.AttributeId} name={d.Name} value={d.Name} />
                  <CLabel variant="custom-checkbox" htmlFor={d.AttributeId}>{d.Name}</CLabel>
                </CFormGroup>
              </CCol>
            ))}
          </CFormGroup>
          <CFormGroup row>
            <CCol md="12">
              <CLabel><b>Tiện ích xung quanh</b></CLabel>
            </CCol>
            {utility.map((d, i) => (
              <CCol md="3" key={`${d}-${i}`}>
                <CFormGroup variant="custom-radio" inline>
                  <CInputRadio custom id={d.AttributeId} name={d.Name} value={d.Name} />
                  <CLabel variant="custom-checkbox" htmlFor={d.AttributeId}>{d.Name}</CLabel>
                </CFormGroup>
              </CCol>
            ))}
          </CFormGroup>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary">
          <CIcon name="cil-scrubber" /> Tiếp theo
        </CButton>
        <CButton type="reset" size="sm" color="danger" onClick={onPrevious}>
          <CIcon name="cil-ban" /> Trở về
        </CButton>
      </CCardFooter>
    </>
  )
}

export default withRouter(Step1);
