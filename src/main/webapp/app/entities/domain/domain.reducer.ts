import axios from 'axios';
import { ICrudGetAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from '../../reducers/action-type.util';
import { messages, SERVER_API_URL } from '../../config/constants';

// import { Domain } from './domain.model';

export const ACTION_TYPES = {
  FETCH_DOMAINS: 'domain/FETCH_DOMAINS',
  FETCH_addresses: 'addresses/FETCH_addresses',
  FETCH_customers: 'customers/FETCH_customers',
  FETCH_users: 'users/FETCH_users',
  FETCH_DOMAIN:  'domain/FETCH_DOMAIN',
  CREATE_DOMAIN: 'domain/CREATE_DOMAIN',
  UPDATE_DOMAIN: 'domain/UPDATE_DOMAIN',
  DELETE_DOMAIN: 'domain/DELETE_DOMAIN'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {},
  addresses: [],
  customers: [],
  users: [],
  updating: false,
  updateSuccess: false
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_addresses):
    case REQUEST(ACTION_TYPES.FETCH_customers):
    case REQUEST(ACTION_TYPES.FETCH_users):
    case REQUEST(ACTION_TYPES.FETCH_DOMAINS):
    case REQUEST(ACTION_TYPES.FETCH_DOMAIN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_DOMAIN):
    case REQUEST(ACTION_TYPES.UPDATE_DOMAIN):
    case REQUEST(ACTION_TYPES.DELETE_DOMAIN):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_addresses):
    case FAILURE(ACTION_TYPES.FETCH_customers):
    case FAILURE(ACTION_TYPES.FETCH_users):
    case FAILURE(ACTION_TYPES.FETCH_DOMAINS):
    case FAILURE(ACTION_TYPES.FETCH_DOMAIN):
    case FAILURE(ACTION_TYPES.CREATE_DOMAIN):
    case FAILURE(ACTION_TYPES.UPDATE_DOMAIN):
    case FAILURE(ACTION_TYPES.DELETE_DOMAIN):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_addresses):
      return {
        ...state,
        loading: false,
        addresses: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_customers):
      return {
        ...state,
        loading: false,
        customers: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_users):
      return {
        ...state,
        loading: false,
        users: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_DOMAINS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_DOMAIN):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_DOMAIN):
    case SUCCESS(ACTION_TYPES.UPDATE_DOMAIN):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_DOMAIN):
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

const apiUrl = SERVER_API_URL + '/api/domains';

// Actions

export const getaddresses: ICrudGetAction = () => ({
  type: ACTION_TYPES.FETCH_addresses,
  payload: axios.get(`/api/addresses?cacheBuster=${new Date().getTime()}`)
});

export const getcustomers: ICrudGetAction = () => ({
  type: ACTION_TYPES.FETCH_customers,
  payload: axios.get(`/api/customers?cacheBuster=${new Date().getTime()}`)
});

export const getusers: ICrudGetAction = () => ({
  type: ACTION_TYPES.FETCH_users,
  payload: axios.get(`/api/users?cacheBuster=${new Date().getTime()}`)
});

export const getEntities: ICrudGetAction = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_DOMAINS,
  payload: axios.get(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DOMAIN,
    payload: axios.get(requestUrl)
  };
};

export const createEntity: ICrudPutAction = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_DOMAIN,
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
    type: ACTION_TYPES.UPDATE_DOMAIN,
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
    type: ACTION_TYPES.DELETE_DOMAIN,
    meta: {
      successMessage: messages.DATA_DELETE_SUCCESS_ALERT,
      errorMessage: messages.DATA_UPDATE_ERROR_ALERT
    },
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};
