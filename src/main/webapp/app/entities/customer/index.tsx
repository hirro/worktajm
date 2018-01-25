import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ModalRoute } from 'react-router-modal';

import Customer from './customer';
import CustomerDetail from './customer-detail';
import CustomerDialog from './customer-dialog';
import CustomerDeleteDialog from './customer-delete-dialog';

const Routes = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={match.url} component={Customer} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/new`} component={CustomerDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/delete`} component={CustomerDeleteDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/edit`} component={CustomerDialog} />
      <Route exact path={`${match.url}/:id`} component={CustomerDetail} />
    </Switch>
  </div>
);

export default Routes;
