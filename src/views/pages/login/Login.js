import React from 'react'
import Axios from 'axios';  
import { useForm } from 'react-hook-form';
import { useCookie } from '@use-hook/use-cookie';
import { useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

function Login() {

  const { register, errors, handleSubmit, reset } = useForm();
  const defaultValues = {
    PhoneNumber: '',
    Password: ''
  };
  const resetForm = () => {
    reset(defaultValues);
  }

  const [ClientId,    setClientId]    = useCookie('Client');
  const [AccessToken, setAccessToken] = useCookie('X-Auth-Token');
  const [UserId,      setUserId]      = useCookie('UserId');
  const history = useHistory();

  const LoginSubmit = data => {
    Axios.post('http://' + window.location.hostname + '/v1/users/login', {
      'PhoneNumber': data.PhoneNumber,
      'Password': data.Password
    })
    .then(res => {
      let data = res.data;
      if (data === 'wrongphonenumberorpassword') {
        alert('Số điện thoại không đúng hoặc sai mật khẩu');
      } else {
        setClientId(data.ClientId, { expires: 3 });
        setAccessToken(data.AccessToken, { expires: 3 });
        setUserId(data.UserId, { expires: 3 });
        history.push('/');
      }
    })
    .catch(error => {
      console.log(error);
    });
  };

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Đăng nhập Admin</h1>
                    <p className="text-muted">Chỉ quản trị viên mới có thể đang nhập</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <input className="form-control input" 
                        type="number" 
                        placeholder="Số điện thoại"
                        name="PhoneNumber" 
                        autoComplete="phonenumber"
                        ref={register({ required: true, maxLength: 10, minLength: 10 })} 
                      />
                    </CInputGroup>
                      {errors.PhoneNumber?.type === "required" && 
                        <span className="errortext">
                          Vui lòng nhập số điện thoại!
                        </span>
                      }
                      {errors.PhoneNumber?.type === "maxLength" && 
                        <span className="errortext">
                          Chưa đúng định dạng số điện thoại!
                        </span>
                      }
                      {errors.PhoneNumber?.type === "minLength" && 
                        <span className="errortext">
                          Chưa đúng định dạng số điện thoại!
                        </span>
                      }
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <input 
                        className="form-control input" 
                        type="password" 
                        placeholder="Mật khẩu" 
                        name="Password"  
                        autoComplete="current-password" 
                        ref={register({ required: true, minLength: 6 })}
                      />
                    </CInputGroup>
                      {errors.Password?.type === "required" && 
                        <span className="errortext">
                          Vui lòng nhập mật khẩu!
                        </span>
                      }
                      {errors.Password?.type === "minLength" && 
                        <span className="errortext">
                          Mật khẩu phải lớn hơn 6 kí tự!
                        </span>
                      }
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick={handleSubmit(LoginSubmit)}>Đăng nhập</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Quên mật khẩu?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>SÀN TMĐT BĐS</h2>
                    <p>Chào mừng quản trị viên!</p>
                    {/* <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>Trở về</CButton>
                    </Link> */}
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
