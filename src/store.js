import { createStore } from 'redux'
import changeState from './reducers/approval';
import LoadApproval from './reducers/approval';


const store = createStore(
  LoadApproval,
  changeState
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
export default store