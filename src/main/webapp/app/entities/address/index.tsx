import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ModalRoute } from 'react-router-modal';

import Address from './address';
import AddressDetail from './address-detail';
import AddressDialog from './address-dialog';
import AddressDeleteDialog from './address-delete-dialog';

const Routes = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={match.url} component={Address} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/new`} component={AddressDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/delete`} component={AddressDeleteDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/edit`} component={AddressDialog} />
      <Route exact path={`${match.url}/:id`} component={AddressDetail} />
    </Switch>
  </div>
);

export default Routes;
