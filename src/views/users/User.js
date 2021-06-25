import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';


function User({match}) {

  const [usersData, setUserData] = useState([]);
  useEffect(() => {
    Axios.get('http://' + window.location.hostname + '/v1/users/getallusers')
    .then(res => {
      setUserData(res.data);
    })
  }, []);

  const user = usersData.find( user => user.UserId.toString() === match.params.UserId)
  const userDetails = user ? Object.entries(user) : 
    [['UserId', (<span><CIcon className="text-muted" /> Not found</span>)]]

  return (
    <CRow>
      <CCol lg={6}>
        <CCard>
          <CCardHeader>
            User id: {match.params.id}
          </CCardHeader>
          <CCardBody>
              <table className="table table-striped table-hover">
                <tbody>
                  {
                    userDetails.map(([key, value], index) => {
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
        </CCard>
      </CCol>
    </CRow>
  )
}

export default User
