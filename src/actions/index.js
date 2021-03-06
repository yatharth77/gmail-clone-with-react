import { ADD_ACCESS_TOKEN, SET_USER_SIGNED_IN, SET_HISTORT_ID, SET_LABEL } from "../constants/action-types";

export function setAccessToken(payload) {
  return { type: ADD_ACCESS_TOKEN, payload }
};

export function setUserSignedIn(payload) {
  return { type: SET_USER_SIGNED_IN, payload }
};

export function setHistoryId(payload) {
  return { type: SET_HISTORT_ID, payload}
}

export function setLabel(payload) {
  return { type: SET_LABEL, payload}
}