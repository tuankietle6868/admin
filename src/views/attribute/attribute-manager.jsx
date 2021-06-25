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
  CCardFooter,
  CButton,
  CForm,
  CFormGroup,
  CFormText,
  CLabel,
  CBadge,
  CDataTable,
  CPagination,
  CSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

const getBadge = status => {
  switch (status) {
    case 'Kích hoạt': return 'success'
    case 'Inactive': return 'secondary'
    case 'Chờ duyệt': return 'warning'
    case 'Cấm': return 'danger'
    default: return 'primary'
  }
}

const AttributeMGR = ({match}) => {

  const { register, reset, errors, handleSubmit, setValue } = useForm('');
  const defaultValues = {
    Description: ''
  };
  const resetForm = () => {
    reset(defaultValues);
  }

  // Cookie
  const [ClientId]    = useCookie('Client');
  const [AccessToken] = useCookie('X-Auth-Token');

  /* =====> Back To Permission <===== */
  const history = useHistory();
  const handleBack = () => {
    history.push('/attributes');
  }

  /* =====> API GET Data <===== */

  const [attributes, setAttributes] = useState([]);
  const [onLoad, setOnLoad] = useState(false);

  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/attributes/parents/0')
    .then(res => {
      let data = res.data;
      setAttributes(data);
    })
  }, [onLoad]);


  /* =====> Data From List <===== */

  const Id = match.params.AttributesId;


  const [attriDetail, setAttriDetails] = useState([]);
  const attriDetails = attriDetail ? Object.entries(attriDetail) :
    [['id', (<span><CIcon className="text-muted" /> Not found</span>)]]

  const [parent, setParent] = useState('');

  /* =====> Set Attribute Name <===== */
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/attributes/' + Id)
    .then(res => {
      let data = res.data;
      setValue('Name', data.Name);
      setParent(data.ParentId);
      setValue('Unit', data.Unit);
      setAttriDetails(data);
    })
  }, [onLoad, Id]);



  /* =====> Current Page <===== */
  const queryPage = useLocation().search.match(/page=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/parents?page=${newPage}`)
  }

  /* =====> API Get Parents <===== */
  const [number, setNumber] = useState(1); // Set Pages number
  const [parents, setParents]   = useState([]);


  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/attributes/parents/' + Id)
    .then(res => {
      let data = res.data;
      setParents(data);
      if (typeof(data) === 'object' && data)
        setNumber(Math.ceil((data).length / 50));
    })
    currentPage !== page && setPage(currentPage)
  }, [currentPage, page, onLoad, Id]);


  /* =====> API POST Attribute <===== */
  const [nofiti, setNofiti] = useState('');
  const onSubmit = data => {
    Axios.put('http://' + window.location.hostname + '/v1/attributes',
    {
      'AttributesId': Id,
      'ParentId': data.AttributeId,
      'Name': data.Name,
      'Status': 1,
      'Unit': data.Unit
    },
    {headers:
      {
        'Client': ClientId,
        'X-Auth-Token':  AccessToken
      }
    })
    .then(res => {
      if (typeof(res.data) === 'object') {
        setNofiti('Sửa thành công!');
        resetForm();
        setOnLoad(true);
        setTimeout(() => {
          setNofiti('');
          setOnLoad(false);
        }, 1000);
      }
    })
  }

  return (
    <CRow>
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
            Attribute Id: {match.params.AttributesId}
          </CCardHeader>
          <CCardBody>
              <table className="table table-striped table-hover">
                <tbody>
                  {
                    attriDetails.map(([key, value], index) => {
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
            <CButton type="reset" size="sm" color="danger" onClick={handleBack}>
              <CIcon name="cilChevronRight" /> Trở về
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
            Chỉnh sửa
            <small> Thuộc tính</small>
            <span style={{ float: "right", color: "#bd0000"}}>{nofiti}</span>
          </CCardHeader>
          <CCardBody>
            <CForm action="" method="post" className="form-horizontal">
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-email">Tên thuộc tính</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <input
                    id="Name"
                    className="form-control"
                    type="text"
                    name="Name"
                    placeholder="Tên thuộc tính..."
                    ref={register({ required: true })}
                  />
                  {errors.Name ?.type === "required" &&
                    <CFormText className="help-block">
                      Nhập tên cho thuộc tính này!
                    </CFormText>
                  }
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="Attribute">Thuộc tính </CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <select
                    id="Attribute"
                    className="form-control"
                    name="AttributeId"
                    ref={register({ required: true })}
                    value={parent}
                    onChange={e => setParent(e.target.value)}
                  >
                    <option value="0">Không có</option>
                    {attributes.map((d, i) => (
                      <option value={d.AttributesId} key={i}>{d.Name}</option>
                    ))}
                  </select>
                  {errors.AttributeId ?.type === "required" &&
                    <CFormText className="help-block">
                      Nhập mô tả cho quyền này!
                    </CFormText>
                  }
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-email">Đơn vị</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <input
                    id="Unit"
                    className="form-control"
                    type="text"
                    name="Unit"
                    placeholder="Đơn vị..."
                    ref={register({ required: true })}
                  />
                </CCol>
              </CFormGroup>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" onClick={handleSubmit(onSubmit)}>
              <CIcon name="cilTask" /> Sửa
            </CButton>
            <CButton type="reset" size="sm" color="danger">
              <CIcon name="cilX" /> Hủy
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol xs="12" md="12">
        <CCard>
          <CCardHeader>
            Danh sách
            <small className="text-muted"> Thuộc tính con</small>
          </CCardHeader>
          <CCardBody>
          <CDataTable
            items={parents}
            fields={[
              { key: 'AttributesId', _classes: 'font-weight-bold' },
              'ParentId', 'Name', 'Unit'
            ]}
            hover
            striped
            itemsPerPage={50}
            activePage={page}
            clickableRows
            onRowClick={(item) => history.push(`/attributes/${item.AttributesId}`)}
            scopedSlots = {{
              'status':
                (item)=>(
                  <td>
                    <CBadge color={getBadge(item.status)}>
                      {item.status}
                    </CBadge>
                  </td>
                )
            }}
          />
          <CPagination
            activePage={page}
            onActivePageChange={pageChange}
            pages={number}
            doubleArrows={true}
            align="center"
          />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AttributeMGR;
