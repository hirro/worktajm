import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale from './locale';
import layout from './layout';
import authentication from './authentication';
import administration from './administration';
import userManagement from './user-management';
import address from '../entities/address/address.reducer';
import project from '../entities/project/project.reducer';
import customer from '../entities/customer/customer.reducer';
import timeEntry from '../entities/time-entry/time-entry.reducer';
import domain from '../entities/domain/domain.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export default combineReducers({
  authentication,
  locale,
  layout,
  administration,
  userManagement,
  address,
  project,
  customer,
  timeEntry,
  domain,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar
});
