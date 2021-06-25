import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useForm } from "react-hook-form";
import { useCookie } from '@use-hook/use-cookie';
import { useHistory, useLocation } from 'react-router-dom';

import { 
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CCarousel,
  CCarouselCaption,
  CCarouselControl,
  CCarouselIndicators,
  CCarouselInner,
  CCarouselItem,
  CCardFooter,
  CButton,
  CForm,
  CFormGroup,
  CFormText,
  CLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';


function Edit({match}) {

  const { register, reset, errors, handleSubmit } = useForm('');
  const defaultValues = {
    Name: '',
    Description: ''
  };
  const resetForm = () => {
    reset(defaultValues);
  }

  /* =====> Cookie <===== */
  const [ClientId]    = useCookie('Client');
  const [AccessToken] = useCookie('X-Auth-Token');

  /* =====> Back to permission <===== */
  const history = useHistory();
  const handleBack = () => {
    history.push('/cadastre');
  }

  /* =====> API GET Data GroupName <===== */
  const [onLoad, setOnLoad] = useState(false);
  const [sell, setSell] = useState([]);
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/sell')
    .then(res => {
      setSell(res.data);
    })
  }, [1, onLoad]);

  /* =====> Data From List <===== */
  const list = sell.find( list => list.SellId.toString() === match.params.SellId)
  const listDetails = list ? Object.entries(list) : 
    [['id', (<span><CIcon className="text-muted" /> Not found</span>)]]
  const Id = match.params.SellId;

  const [slides, setSlides] = useState([]);
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/medias/homes/' + Id)
    .then(res => {
      setSlides(res.data);
    })
  }, [1]);


  const handleOpenEdit = () => {
    setOnLoad(false);
    setOpenEdit(true)
  }

  /* =====> API Edit <===== */
  const [openEdit, setOpenEdit] = useState(false);
  const [notifi, setNotifi]     = useState('');
  const onSubmit = data => {
    setOpenEdit(false);
    Axios.put('http://' + window.location.hostname + '/v1/groupnames',
    {
      'SellId': Id,
      'GroupNameName': data.Name,
      'GroupNameDescription': data.Description
    },
    {headers:
      {
        'Client': ClientId,
        'X-Auth-Token':  AccessToken
      }
    })
    .then(res => {
      if (typeof(res.data) === 'object') { // Edited
        setOnLoad(true);
        resetForm();
        setNotifi('Chỉnh sửa thành công!');
        setTimeout(() => {
          setNotifi('');
        }, 1000);
      }
    })
  }
  
  /* =====> API Delete ?????????? <===== */
  const handleDelete = () => {
    Axios.DELETE('http://' + window.location.hostname + '/v1/groupnames' + Id,
    {headers:
      {
        'Client': ClientId,
        'X-Auth-Token':  AccessToken
      }
    })
    .then(res => {
      console.log(res.data);
    })
  }

    /* =====> Current Page <===== */
    // const history = useHistory()
    const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
    const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
    const [page, setPage] = useState(currentPage)
  
    const pageChange = newPage => {
      currentPage !== newPage && history.push(`/group?page=${newPage}`)
    }
  
    // const [onLoad, setOnLoad] = useState(false);
    const [permissions, setPermissions] = useState([]);
    useEffect(() => {
      Axios.get('http://' + window.location.hostname + '/v1/groupnames/' + Id + '/permissions')
      .then(res => {
        setPermissions(res.data);
      })
      currentPage !== page && setPage(currentPage)
    }, [1, currentPage, page, onLoad])

  return (
    <CRow>
      <CCol xs="12" md="6" style={{ display: openEdit ? "block" : "none"}}>
        <CCard>
          <CCardHeader>
            Thẩm định
            <small>Địa chính</small>
          </CCardHeader>
          <CCardBody>
            <CForm action="" method="post" className="form-horizontal">
              {/* <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-email">Tên nhóm</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <input
                    id="Name"
                    className="form-control"
                    type="text"
                    name="Name" 
                    placeholder="Tên nhóm..."
                    ref={register({ required: true })}  
                  />
                  {errors.Name ?.type === "required" &&
                    <CFormText className="help-block">
                      Nhập tên cho nhóm này!
                    </CFormText>
                  }
                </CCol>
              </CFormGroup> */}
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="Description">Xác nhận và đánh giá BĐS</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <textarea
                    id="Description"
                    className="form-control"
                    type="text"
                    name="Description" 
                    placeholder="Mô tả..."
                    ref={register({ required: true })}  
                  />
                  {errors.Description ?.type === "required" &&
                    <CFormText className="help-block">
                      Nhập mô tả cho nhóm này!
                    </CFormText>
                  }
                </CCol>
              </CFormGroup>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" onClick={handleSubmit(onSubmit)}>
              <CIcon name="cilTask" /> Đồng ý
            </CButton>
            <CButton type="reset" size="sm" color="danger" onClick={e => setOpenEdit(false)}>
              <CIcon name="cilX" /> Hủy
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
            ID BĐS: {match.params.SellId}
            <span style={{ float: "right", color: "#bd0000"}}>{notifi}</span>
          </CCardHeader>
          <CCardBody>
              <table className="table table-striped table-hover">
                <tbody>
                  {
                    listDetails.map(([key, value], index) => {
                      return (
                        <tr key={index.toString()}>
                          <td>{`${key}:`}</td>
                          <td><strong>{value}</strong></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" onClick={handleOpenEdit}> 
              <CIcon name="cilSettings" /> Thẩm định
            </CButton>
            <CButton type="submit" size="sm" color="primary" onClick={handleDelete}>
              <CIcon name="cilXCircle" /> Từ chối
            </CButton>
            <CButton type="reset" size="sm" color="danger" onClick={handleBack}>
              <CIcon name="cilChevronRight" /> Trở về
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol xs="12" xl="6">
        <CCard>
          <CCardHeader>
            Hình ảnh của BĐS
          </CCardHeader>
          <CCardBody>
            <CCarousel animate autoSlide={3000}>
              <CCarouselIndicators/>
              <CCarouselInner>
                {slides.map(d => (
                  <CCarouselItem key={d.MediaId}>
                    <img className="d-block w-100" src={`http://${window.location.hostname}${d.Url}`} alt={d.MediaId}/>
                    {/* <CCarouselCaption><h3>Slide 1</h3><p>Slide 1</p></CCarouselCaption> */}
                  </CCarouselItem>
                ))}
                {/* <CCarouselItem>
                  <img className="d-block w-100" src={slides[1]} alt="slide 2"/>
                  <CCarouselCaption><h3>Slide 2</h3><p>Slide 2</p></CCarouselCaption>
                </CCarouselItem>
                <CCarouselItem>
                  <img className="d-block w-100" src={slides[2]} alt="slide 3"/>
                  <CCarouselCaption><h3>Slide 3</h3><p>Slide 3</p></CCarouselCaption>
                </CCarouselItem> */}
              </CCarouselInner>
              <CCarouselControl direction="prev"/>
              <CCarouselControl direction="next"/>
            </CCarousel>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Edit;
