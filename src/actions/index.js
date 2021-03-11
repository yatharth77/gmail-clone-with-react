import { ADD_ACCESS_TOKEN, SET_USER_SIGNED_IN, SET_ACTIVE_LABEL } from "../constants/action-types";

export function setAccessToken(payload) {
  return { type: ADD_ACCESS_TOKEN, payload }
};

export function setUserSignedIn(payload) {
  return { type: SET_USER_SIGNED_IN, payload }
};

export function setActiveLabel(payload) {
  return { type: SET_ACTIVE_LABEL, payload}
}