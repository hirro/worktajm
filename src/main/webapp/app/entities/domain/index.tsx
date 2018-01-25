import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ModalRoute } from 'react-router-modal';

import Domain from './domain';
import DomainDetail from './domain-detail';
import DomainDialog from './domain-dialog';
import DomainDeleteDialog from './domain-delete-dialog';

const Routes = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={match.url} component={Domain} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/new`} component={DomainDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/delete`} component={DomainDeleteDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/edit`} component={DomainDialog} />
      <Route exact path={`${match.url}/:id`} component={DomainDetail} />
    </Switch>
  </div>
);

export default Routes;
