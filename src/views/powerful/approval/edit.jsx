import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useCookie } from '@use-hook/use-cookie';
import { useHistory } from 'react-router-dom';
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
  CSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

const Edit = ({match}) => {

  /* ====================
        Section Info
     ==================== */

  /* =====> Cookie <===== */
  const [ClientId]    = useCookie('Client');
  const [AccessToken] = useCookie('X-Auth-Token');

  /* =====> Back to permission <===== */
  const history = useHistory();
  const handleBack = () => {
    history.push('/approval');
  }

  /* =====> Get data <===== */
  const [onLoad, setOnLoad] = useState(false);
  const [approvalData, setApprovalData] = useState([]);
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/approvalmanager')
    .then(res => {
      setApprovalData(res.data);
    })
  }, [1, onLoad]);

  /* =====> Data from list <===== */
  const approval = approvalData.find( approval => approval.ApprovalManagerId.toString() === match.params.ApprovalManagerId)
  const approvalDetails = approval ? Object.entries(approval) : 
    [['id', (<span><CIcon className="text-muted" /> Not found</span>)]]
  const Id = match.params.ApprovalManagerId;

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => {
    setOnLoad(false);
    setOpenEdit(true);
    setDisUser(false);
    setDisGroup(false);
    setDisProv(false);
  }

  /* ====================
        Section Edit
     ==================== */

  /* =====> API Get Group, User, Province, District, Ward <===== */
  const [groups, setGroups]       = useState([]);
  const [users, setUsers]         = useState([]);
  const [province, setProvince]   = useState([]);
  const [districts, setDistricts] = useState([]);
  const [provValue, setProvValue] = useState('00');
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/groupnames')
    .then(res => {
      setGroups(res.data);
    })
    Axios.get('http://' + window.location.hostname + '/v1/users/getallusers')
    .then(res => {
      setUsers(res.data);
    })
    Axios.get('http://' + window.location.hostname + '/v1/address/provinces')
    .then(res => {
      setProvince(res.data);
    })
    if (provValue !== '00') {
      Axios.get('http://' + window.location.hostname + '/v1/address/districts/' + provValue)
      .then(res => {
        setDistricts(res.data);
      })
    }
  }, [1, openEdit, provValue]);

  /* =====> Check Condition <===== */
  const [groupValue, setGroupValue] = useState('00');
  const [userValue, setUserValue]   = useState('00');
  const [distValue, setDistValue]   = useState('00');
  const [disGroup, setDisGroup]     = useState(false);
  const [disUser, setDisUser]       = useState(false);
  const [disProv, setDisProv]       = useState(false);
  useEffect(() => {
    if (groupValue !== '00') {  // Disable Select User
      setDisUser(true);
    } else {
      setDisUser(false);
    }
    if (userValue !== '00') { // Disable Select Group
      setDisGroup(true);
    } else {
      setDisGroup(false);
    }
    if (distValue !== '00') { // Disable Select Province
      setDisProv(true);
      setProvValue('00');
    } else {
      setDisProv(false)
    }
  }, [groupValue, userValue, distValue]);


  /* =====> API Put Approval <===== */
  const [nofiti, setNofiti] = useState('');
  const onSubmit = () => {
    if ((groupValue !== '00' || userValue !== '00') && (provValue !== '00' || distValue !== '00')) {  //Eligible
      Axios.put('http://' + window.location.hostname + '/v1/approvalmanager',
      {
        'ApprovalManagerId': Id,
        'ProvinceId': provValue,
        'DistrictId': distValue,
        'WardId': '0',
        'UserId': userValue,
        'GroupNameId': groupValue
      },
      {headers:
        {
          'Client': ClientId,
          'X-Auth-Token':  AccessToken
        }
      })
      .then(res => {
        if (typeof(res.data) === 'object') {  // Edited
          setNofiti('S???a th??nh c??ng!');
          setGroups([]);
          setUsers([]);
          setProvince([]);
          setDistricts([]);
          setOnLoad(true);
          setTimeout(() => {
            setOpenEdit(false);
            setNofiti('');
          }, 1000);
        }
      })
    } else if (groupValue !== '00' || userValue !== '00') {  // Unqualified
      setNofiti('Vui l??ng ch???n khu v???c');
    } else if (provValue !== '00' || distValue !== '00') { // Unqualified
      setNofiti('Vui l??ng ch???n nh??m ho???c ng?????i qu???n l??');
    } else { // Unqualified
      setNofiti('Vui l??ng ch???n th??ng tin!');
    }
  }

  
  /* =====> API Delete ?????????? <===== */ 
  const handleDelete = () => {
    Axios.DELETE('http://' + window.location.hostname + '/v1/approvalmanager' + Id,
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

  return (
    <CRow>
      <CCol xs="12" md="6" style={{ display: openEdit ? "block" : "none"}}>
        <CCard>
          <CCardHeader>
            Th??m
            <small> Khu v???c</small>
            <span style={{ float: "right", color: "#bd0000"}}>{nofiti}</span>
          </CCardHeader>
          <CCardBody>
            <CForm action="" method="post" className="form-horizontal">
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="hf-email">Nh??m</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect disabled={disGroup} onChange={e =>
                    setGroupValue(e.target.value)} onClick={e => setNofiti("")}>
                    <option value="00">Nh??m</option>
                    {groups.map((d, i) => (
                    <option value={d.GroupNameId} key={`${d}-${i}`}>{`${d.GroupNameName} (ID: ${d.GroupNameId})`}</option>
                    ))}
                  </CSelect>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="Description">Ng?????i d??ng</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect disabled={disUser} onChange={e =>
                    setUserValue(e.target.value)} onClick={e => setNofiti("")}>
                    <option value="00">Ng?????i d??ng</option>
                    {users.map((d, i) => (
                    <option value={d.UserId} key={`${d}-${i}`}>{`${d.Name} (ID: ${d.UserId})`}</option>
                    ))}
                  </CSelect>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="Description">T???nh th??nh ph???</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect disabled={disProv} onChange={e =>
                    setProvValue(e.target.value)} onClick={e => setNofiti("")}>
                    <option value="00">T???nh th??nh ph???</option>
                    {province.map((d, i) => (
                    <option value={d.ProvinceId} key={`${d}-${i}`}>{`${d.Name} (ID: ${d.ProvinceId})`}</option>
                    ))}
                  </CSelect>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="Description">Qu???n huy???n</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect onChange={e =>
                    setDistValue(e.target.value)} onClick={e => setNofiti("")}>
                    <option value="00">Qu???n huy???n</option>
                    {districts.map((d, i) => (
                    <option value={d.DistrictId} key={`${d}-${i}`}>{`${d.Name} (ID: ${d.DistrictId})`}</option>
                    ))}
                  </CSelect>
                </CCol>
              </CFormGroup>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="submit" size="sm" color="primary" onClick={onSubmit}>
            <CIcon name="cilTask" /> S???a
            </CButton>
            <CButton type="reset" size="sm" color="danger" onClick={e => setOpenEdit(false)}>
            <CIcon name="cilX" /> H???y
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol xs="12" md="6">
        <CCard>
          <CCardHeader>
          Qu???n l?? khu v???c c?? ID: {match.params.ApprovalManagerId}
            {/* <span style={{ float: "right", color: "#bd0000"}}>{nofiti}</span> */}
          </CCardHeader>
          <CCardBody>
              <table className="table table-striped table-hover">
                <tbody>
                  {
                    approvalDetails.map(([key, value], index) => {
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
              <CIcon name="cilSettings" /> Ch???nh s???a
            </CButton>
            <CButton type="submit" size="sm" color="primary" onClick={handleDelete}>
              <CIcon name="cilXCircle" /> X??a
            </CButton>
            <CButton type="reset" size="sm" color="danger" onClick={handleBack}>
              <CIcon name="cilChevronRight" /> Tr??? v???
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Edit;
