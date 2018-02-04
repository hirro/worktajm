import axios from 'axios';
import { ICrudGetAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from '../../reducers/action-type.util';
import { messages, SERVER_API_URL } from '../../config/constants';

// import { Project } from './project.model';

export const ACTION_TYPES = {
  FETCH_PROJECTS: 'project/FETCH_PROJECTS',
  SEARCH_PROJECTS: 'project/SEARCH_PROJECTS',
  FETCH_users: 'users/FETCH_users',
  FETCH_customers: 'customers/FETCH_customers',
  FETCH_PROJECT:  'project/FETCH_PROJECT',
  CREATE_PROJECT: 'project/CREATE_PROJECT',
  UPDATE_PROJECT: 'project/UPDATE_PROJECT',
  DELETE_PROJECT: 'project/DELETE_PROJECT'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {},
  users: [],
  customers: [],
  updating: false,
  updateSuccess: false
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_users):
    case REQUEST(ACTION_TYPES.FETCH_customers):
    case REQUEST(ACTION_TYPES.FETCH_PROJECTS):
    case REQUEST(ACTION_TYPES.SEARCH_PROJECTS):
    case REQUEST(ACTION_TYPES.FETCH_PROJECT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_PROJECT):
    case REQUEST(ACTION_TYPES.UPDATE_PROJECT):
    case REQUEST(ACTION_TYPES.DELETE_PROJECT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_users):
    case FAILURE(ACTION_TYPES.FETCH_customers):
    case FAILURE(ACTION_TYPES.FETCH_PROJECTS):
    case FAILURE(ACTION_TYPES.SEARCH_PROJECTS):
    case FAILURE(ACTION_TYPES.FETCH_PROJECT):
    case FAILURE(ACTION_TYPES.CREATE_PROJECT):
    case FAILURE(ACTION_TYPES.UPDATE_PROJECT):
    case FAILURE(ACTION_TYPES.DELETE_PROJECT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_users):
      return {
        ...state,
        loading: false,
        users: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_customers):
      return {
        ...state,
        loading: false,
        customers: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECTS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SEARCH_PROJECTS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
    };
    case SUCCESS(ACTION_TYPES.FETCH_PROJECT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROJECT):
    case SUCCESS(ACTION_TYPES.UPDATE_PROJECT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROJECT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    default:
      return state;
  }
};

const apiUrl = SERVER_API_URL + '/api/projects';
const apiSearchUrl = SERVER_API_URL + '/api/_search/projects';

// Actions

export const getusers: ICrudGetAction = () => ({
  type: ACTION_TYPES.FETCH_users,
  payload: axios.get(`/api/users?cacheBuster=${new Date().getTime()}`)
});

export const getcustomers: ICrudGetAction = () => ({
  type: ACTION_TYPES.FETCH_customers,
  payload: axios.get(`/api/customers?cacheBuster=${new Date().getTime()}`)
});

export const getEntities: ICrudGetAction = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_PROJECTS,
  payload: axios.get(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getSearchEntities: ICrudGetAction = query => ({
  type: ACTION_TYPES.SEARCH_PROJECTS,
  payload: axios.get(`${apiSearchUrl}?query=` + query)
});

export const getEntity: ICrudGetAction = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROJECT,
    payload: axios.get(requestUrl)
  };
};

export const createEntity: ICrudPutAction = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROJECT,
    meta: {
      successMessage: messages.DATA_CREATE_SUCCESS_ALERT,
      errorMessage: messages.DATA_UPDATE_ERROR_ALERT
    },
    payload: axios.post(apiUrl, entity)
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROJECT,
    meta: {
      successMessage: messages.DATA_CREATE_SUCCESS_ALERT,
      errorMessage: messages.DATA_UPDATE_ERROR_ALERT
    },
    payload: axios.put(apiUrl, entity)
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROJECT,
    meta: {
      successMessage: messages.DATA_DELETE_SUCCESS_ALERT,
      errorMessage: messages.DATA_UPDATE_ERROR_ALERT
    },
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};
