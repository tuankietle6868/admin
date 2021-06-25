import { createSelector } from 'reselect';

const defaultState = {
  load: false
};
export const loadSelector = createSelector(
  (state) => state.load,
  (load) => load
);

const onLoad = 'Load';

export const Load = () => ({ 
  type: onLoad,
});


function LoadApproval(state = defaultState, action) {
  switch (action) {
    case onLoad:
      return {
        ...state,
        load: true
      };
    default:
      return state;
  }
}



export default LoadApproval;
