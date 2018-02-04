import axios from 'axios';
import { ICrudGetAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from '../../reducers/action-type.util';
import { messages, SERVER_API_URL } from '../../config/constants';

// import { Customer } from './customer.model';

export const ACTION_TYPES = {
  FETCH_CUSTOMERS: 'customer/FETCH_CUSTOMERS',
  SEARCH_CUSTOMERS: 'customer/SEARCH_CUSTOMERS',
  FETCH_addresses: 'addresses/FETCH_addresses',
  FETCH_projects: 'projects/FETCH_projects',
  FETCH_domains: 'domains/FETCH_domains',
  FETCH_CUSTOMER:  'customer/FETCH_CUSTOMER',
  CREATE_CUSTOMER: 'customer/CREATE_CUSTOMER',
  UPDATE_CUSTOMER: 'customer/UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'customer/DELETE_CUSTOMER'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {},
  addresses: [],
  projects: [],
  domains: [],
  updating: false,
  updateSuccess: false
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_addresses):
    case REQUEST(ACTION_TYPES.FETCH_projects):
    case REQUEST(ACTION_TYPES.FETCH_domains):
    case REQUEST(ACTION_TYPES.FETCH_CUSTOMERS):
    case REQUEST(ACTION_TYPES.SEARCH_CUSTOMERS):
    case REQUEST(ACTION_TYPES.FETCH_CUSTOMER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CUSTOMER):
    case REQUEST(ACTION_TYPES.UPDATE_CUSTOMER):
    case REQUEST(ACTION_TYPES.DELETE_CUSTOMER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_addresses):
    case FAILURE(ACTION_TYPES.FETCH_projects):
    case FAILURE(ACTION_TYPES.FETCH_domains):
    case FAILURE(ACTION_TYPES.FETCH_CUSTOMERS):
    case FAILURE(ACTION_TYPES.SEARCH_CUSTOMERS):
    case FAILURE(ACTION_TYPES.FETCH_CUSTOMER):
    case FAILURE(ACTION_TYPES.CREATE_CUSTOMER):
    case FAILURE(ACTION_TYPES.UPDATE_CUSTOMER):
    case FAILURE(ACTION_TYPES.DELETE_CUSTOMER):
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
    case SUCCESS(ACTION_TYPES.FETCH_projects):
      return {
        ...state,
        loading: false,
        projects: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_domains):
      return {
        ...state,
        loading: false,
        domains: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CUSTOMERS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SEARCH_CUSTOMERS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
    };
    case SUCCESS(ACTION_TYPES.FETCH_CUSTOMER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CUSTOMER):
    case SUCCESS(ACTION_TYPES.UPDATE_CUSTOMER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CUSTOMER):
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

const apiUrl = SERVER_API_URL + '/api/customers';
const apiSearchUrl = SERVER_API_URL + '/api/_search/customers';

// Actions

export const getaddresses: ICrudGetAction = () => ({
  type: ACTION_TYPES.FETCH_addresses,
  payload: axios.get(`/api/addresses?cacheBuster=${new Date().getTime()}`)
});

export const getprojects: ICrudGetAction = () => ({
  type: ACTION_TYPES.FETCH_projects,
  payload: axios.get(`/api/projects?cacheBuster=${new Date().getTime()}`)
});

export const getdomains: ICrudGetAction = () => ({
  type: ACTION_TYPES.FETCH_domains,
  payload: axios.get(`/api/domains?cacheBuster=${new Date().getTime()}`)
});

export const getEntities: ICrudGetAction = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CUSTOMERS,
  payload: axios.get(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getSearchEntities: ICrudGetAction = query => ({
  type: ACTION_TYPES.SEARCH_CUSTOMERS,
  payload: axios.get(`${apiSearchUrl}?query=` + query)
});

export const getEntity: ICrudGetAction = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CUSTOMER,
    payload: axios.get(requestUrl)
  };
};

export const createEntity: ICrudPutAction = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CUSTOMER,
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
    type: ACTION_TYPES.UPDATE_CUSTOMER,
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
    type: ACTION_TYPES.DELETE_CUSTOMER,
    meta: {
      successMessage: messages.DATA_DELETE_SUCCESS_ALERT,
      errorMessage: messages.DATA_UPDATE_ERROR_ALERT
    },
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};
