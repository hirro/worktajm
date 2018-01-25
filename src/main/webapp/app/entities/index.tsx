import * as React from 'react';
// tslint:disable-next-line:no-unused-variable
import { Route, Switch } from 'react-router-dom';

import Address from './address';
import Project from './project';
import Customer from './customer';
import TimeEntry from './time-entry';
import Domain from './domain';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      <Route path={'/address'} component={Address}/>
      <Route path={'/project'} component={Project}/>
      <Route path={'/customer'} component={Customer}/>
      <Route path={'/time-entry'} component={TimeEntry}/>
      <Route path={'/domain'} component={Domain}/>
      {/* jhipster-needle-add-route-path - JHipster will routes here */}
    </Switch>
  </div>
);

export default Routes;
