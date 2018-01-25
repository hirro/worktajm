import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ModalRoute } from 'react-router-modal';

import TimeEntry from './time-entry';
import TimeEntryDetail from './time-entry-detail';
import TimeEntryDialog from './time-entry-dialog';
import TimeEntryDeleteDialog from './time-entry-delete-dialog';

const Routes = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={match.url} component={TimeEntry} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/new`} component={TimeEntryDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/delete`} component={TimeEntryDeleteDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/edit`} component={TimeEntryDialog} />
      <Route exact path={`${match.url}/:id`} component={TimeEntryDetail} />
    </Switch>
  </div>
);

export default Routes;
