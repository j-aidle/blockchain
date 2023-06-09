const actions = {
  init: "INIT",
  addAdmin: 'ADD_ADMIN'
};

const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
  role: 'unknown',
  loading: true
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    case actions.addAdmin:
      return { state: { ...state, role: 'admin'}}
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };
