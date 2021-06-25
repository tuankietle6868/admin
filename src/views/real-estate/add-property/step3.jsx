import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import Dropzone from 'react-dropzone-uploader';
// import 'react-dropzone-uploader/dist/styles.css';
import {
  CCardBody,
  CCol,
  CLabel,
  CCardFooter,
  CButton,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'


function Step1(props) {

  const onPrevious = () => {
    props.history.push('/step2home');
  }

  const onSubmit = () => {
    props.history.push('/step4');
  }

  const getUploadParams = () => {
    return { url: 'https://httpbin.org/post' }
  }

  const handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  }

  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }


  return (
    <>
      <CCardBody>
        <CRow>
          <CCol xs="12" sm="12">
            <h5>Hình ảnh</h5>
          </CCol>
          <CCol xs="12" sm="6">
            <CLabel><b>Ngoại thất</b></CLabel>
            <Dropzone
              getUploadParams={getUploadParams}
              onChangeStatus={handleChangeStatus}
              onSubmit={handleSubmit}
              inputContent="Kéo thả hoặc nhấn vào đây"
              styles={{ dropzoneActive: { borderColor: '#bd0000' }}}
            />
          </CCol>
          <CCol xs="12" sm="6">
            <CLabel><b>Nội thất</b></CLabel>
            <Dropzone
              getUploadParams={getUploadParams}
              onChangeStatus={handleChangeStatus}
              onSubmit={handleSubmit}
              inputContent="Kéo thả hoặc nhấn vào đây"
              styles={{ dropzoneActive: { borderColor: '#bd0000' }}}
            />
          </CCol>
          <CCol xs="12" sm="6">
            <CLabel><b>Phòng khách</b></CLabel>
            <Dropzone
              getUploadParams={getUploadParams}
              onChangeStatus={handleChangeStatus}
              onSubmit={handleSubmit}
              inputContent="Kéo thả hoặc nhấn vào đây"
              styles={{ dropzoneActive: { borderColor: '#bd0000' }}}
            />
          </CCol>
          <CCol xs="12" sm="6">
            <CLabel><b>Phòng ngủ</b></CLabel>
            <Dropzone
              getUploadParams={getUploadParams}
              onChangeStatus={handleChangeStatus}
              onSubmit={handleSubmit}
              inputContent="Kéo thả hoặc nhấn vào đây"
              styles={{ dropzoneActive: { borderColor: '#bd0000' }}}
            />
          </CCol>
          <CCol xs="12" sm="6">
            <CLabel><b>Phòng tắm</b></CLabel>
            <Dropzone
              getUploadParams={getUploadParams}
              onChangeStatus={handleChangeStatus}
              onSubmit={handleSubmit}
              inputContent="Kéo thả hoặc nhấn vào đây"
              styles={{ dropzoneActive: { borderColor: '#bd0000' }}}
            />
          </CCol>
          <CCol xs="12" sm="6">
            <CLabel><b>Bếp</b></CLabel>
            <Dropzone
              getUploadParams={getUploadParams}
              onChangeStatus={handleChangeStatus}
              onSubmit={handleSubmit}
              inputContent="Kéo thả hoặc nhấn vào đây"
              styles={{ dropzoneActive: { borderColor: '#bd0000' }}}
            />
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" onClick={onSubmit}>
          <CIcon name="cil-scrubber" /> Tiếp theo
        </CButton>
        <CButton type="submit" size="sm" color="danger" onClick={onPrevious}>
          <CIcon name="cil-ban" /> Trở về
        </CButton>
      </CCardFooter>
    </>
  )
}

export default withRouter(Step1);
