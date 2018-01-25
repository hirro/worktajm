import axios from 'axios';
import { ICrudGetAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from '../../reducers/action-type.util';
import { messages, SERVER_API_URL } from '../../config/constants';

// import { JhiDateUtils } from 'ng-jhipster';
// import { TimeEntry } from './time-entry.model';

export const ACTION_TYPES = {
  FETCH_TIMEENTRIES: 'timeEntry/FETCH_TIMEENTRIES',
  FETCH_projects: 'projects/FETCH_projects',
  FETCH_users: 'users/FETCH_users',
  FETCH_TIMEENTRY:  'timeEntry/FETCH_TIMEENTRY',
  CREATE_TIMEENTRY: 'timeEntry/CREATE_TIMEENTRY',
  UPDATE_TIMEENTRY: 'timeEntry/UPDATE_TIMEENTRY',
  DELETE_TIMEENTRY: 'timeEntry/DELETE_TIMEENTRY'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {},
  projects: [],
  users: [],
  updating: false,
  updateSuccess: false
};

// Reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_projects):
    case REQUEST(ACTION_TYPES.FETCH_users):
    case REQUEST(ACTION_TYPES.FETCH_TIMEENTRIES):
    case REQUEST(ACTION_TYPES.FETCH_TIMEENTRY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TIMEENTRY):
    case REQUEST(ACTION_TYPES.UPDATE_TIMEENTRY):
    case REQUEST(ACTION_TYPES.DELETE_TIMEENTRY):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_projects):
    case FAILURE(ACTION_TYPES.FETCH_users):
    case FAILURE(ACTION_TYPES.FETCH_TIMEENTRIES):
    case FAILURE(ACTION_TYPES.FETCH_TIMEENTRY):
    case FAILURE(ACTION_TYPES.CREATE_TIMEENTRY):
    case FAILURE(ACTION_TYPES.UPDATE_TIMEENTRY):
    case FAILURE(ACTION_TYPES.DELETE_TIMEENTRY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_projects):
      return {
        ...state,
        loading: false,
        projects: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_users):
      return {
        ...state,
        loading: false,
        users: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_TIMEENTRIES):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_TIMEENTRY):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TIMEENTRY):
    case SUCCESS(ACTION_TYPES.UPDATE_TIMEENTRY):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TIMEENTRY):
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

const apiUrl = SERVER_API_URL + '/api/time-entries';

// Actions

export const getprojects: ICrudGetAction = () => ({
  type: ACTION_TYPES.FETCH_projects,
  payload: axios.get(`/api/projects?cacheBuster=${new Date().getTime()}`)
});

export const getusers: ICrudGetAction = () => ({
  type: ACTION_TYPES.FETCH_users,
  payload: axios.get(`/api/users?cacheBuster=${new Date().getTime()}`)
});

export const getEntities: ICrudGetAction = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_TIMEENTRIES,
  payload: axios.get(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TIMEENTRY,
    payload: axios.get(requestUrl)
  };
};

export const createEntity: ICrudPutAction = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TIMEENTRY,
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
    type: ACTION_TYPES.UPDATE_TIMEENTRY,
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
    type: ACTION_TYPES.DELETE_TIMEENTRY,
    meta: {
      successMessage: messages.DATA_DELETE_SUCCESS_ALERT,
      errorMessage: messages.DATA_UPDATE_ERROR_ALERT
    },
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};
