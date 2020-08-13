import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
} from "./types";
import { setAlert } from "./alert";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
//Load user
export const loadUser = () => async (dispath) => {
  if (localStorage.token) {
    setAuthToken(localStorage.getItem("token"));
  }
  try {
    const res = await axios.get("/api/auth");
    dispath({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispath({
      type: AUTH_ERROR,
    });
  }
};

//register user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post("/api/users", body, config);
    console.log(res.data);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err.response.data);
    if (errors) {
      errors.forEach((error) => {
        return dispatch(setAlert(error.msg, "danger"));
      });
    }
    //console.log(errors);
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};
