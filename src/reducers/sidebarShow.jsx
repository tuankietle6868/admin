const initialState = {
  sidebarShow: 'responsive'
}

const changeState = (state = initialState, { action, ...rest }) => {
  switch (action) {
    case 'set':
      return {...state, ...rest }
    default:
      return state
  }
}

export default changeState;