import { REGISTER_FAIL, REGISTER_SUCCESS } from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.setItem("token", payload.token);
      return { ...state, loading: false, ...payload, isAuthenticated: true };
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return { ...state, loading: false, token: null, isAuuthenticated: false };
    default:
      return state;
  }
}
