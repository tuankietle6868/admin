import React      from 'react';
import Step1      from './step1';
import Home       from './step2/home';
import Apartment  from './step2/apartment';
import Villa      from './step2/villa';
import Officetel  from './step2/officetel';
import Lands      from './step2/lands';
import Factory    from './step2/factory';
import Motel      from './step2/motel';
import Step3      from './step3';
import Step4      from './step4';
import Step5      from './step5';
import                 './style.scss';
import { BrowserRouter as Router, Route }   from 'react-router-dom';
import {
  CCard,
  CCardHeader,
  CCol,
  CRow
} from '@coreui/react';


function AddRealestate() {

  return (
    <CRow>
      <CCol xs="12" sm="8">
        <CCard>
          <CCardHeader>
            Thêm
            <small> Bất động sản</small>
          </CCardHeader>
          <Router>
            <Route path="/step5"               component={Step1}      />
            <Route path="/step2home"      component={Home}           />
            <Route path="/step2apartment" component={Apartment}     />
            <Route path="/step2villa"     component={Villa}        />
            <Route path="/step2officetel" component={Officetel}   />
            <Route path="/step2lands"     component={Lands}      />
            <Route path="/step2factory"   component={Factory}   />
            <Route path="/step2motel"     component={Motel}    />
            <Route path="/step3"          component={Step3}   />
            <Route path="/step4"          component={Step4}  />
            <Route path="/"      exact    component={Step5} />
            
            {/* 
            


            */}
          </Router>
        </CCard>
      </CCol>
    </CRow>
  );
} 

export default AddRealestate;