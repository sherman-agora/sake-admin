import isArray from 'lodash/isArray';

/**
 * constants
 */

export const SET_BREADCRUMBS = 'SET_BREADCRUMBS';
export const ADD_BREADCRUMBS = 'ADD_BREADCRUMBS';

/**
 * action creators
 */

export function setBreadcrumbs(breadcrumbs) {
  return {
    type: SET_BREADCRUMBS,
    payload: breadcrumbs,
  }
}

export function addBreadcrumbs(breadcrumbs) {
  return {
    type: ADD_BREADCRUMBS,
    payload: breadcrumbs,
  }
}

/**
 * initialState
 */

export const initialState = [
  { url: '/', label: 'Dashboard' },
];

/**
 * reducer
 */

export default (previousState = initialState, { type, payload }) => {
  switch (type) {
    case SET_BREADCRUMBS:
      return [...initialState, ...payload];
    case ADD_BREADCRUMBS:
      if (previousState[previousState.length - 1].url === payload.url) {
        return previousState;
      }
      return isArray(payload) ? [...previousState, ...payload] : [...previousState, payload];
    default:
      return previousState;
  }
}