import { PROFILE_ERROR, GET_PROFILE } from "./types";

import axios from "axios";
import { setAlert } from "./alert";

//Get current user prfile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      paload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//create-update a profile

export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("/api/profile", formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert(edit ? "Profile updated" : "Profile created", "success"));
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data;
    //console.log(errors);
    if (errors) {
      // console.log("yesss");
      errors.forEach((error) => {
        return dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      paload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
