import { PROFILE_ERROR, GET_PROFILE } from "./types";
import { setAlert } from "./alert";
import axios from "axios";

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
