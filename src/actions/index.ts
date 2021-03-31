import { ADD_ACCESS_TOKEN, SET_USER_SIGNED_IN, SET_ACTIVE_LABEL } from "../constants/action-types";

export function setAccessToken(payload: string): IsetAccessToken {
  return { type: ADD_ACCESS_TOKEN, payload }
};

export function setUserSignedIn(payload: boolean): IsetUserSignedIn {
  return { type: SET_USER_SIGNED_IN, payload }
};

export function setActiveLabel(payload: any): IsetActiveLabel {
  return { type: SET_ACTIVE_LABEL, payload}
}

export interface IsetAccessToken {
  type: string
  payload: string
}

export interface IsetUserSignedIn {
  type: string
  payload: boolean
}

export interface IsetActiveLabel {
  type: string
  payload: string
}