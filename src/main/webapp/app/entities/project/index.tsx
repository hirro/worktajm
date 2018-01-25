import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ModalRoute } from 'react-router-modal';

import Project from './project';
import ProjectDetail from './project-detail';
import ProjectDialog from './project-dialog';
import ProjectDeleteDialog from './project-delete-dialog';

const Routes = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={match.url} component={Project} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/new`} component={ProjectDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/delete`} component={ProjectDeleteDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/edit`} component={ProjectDialog} />
      <Route exact path={`${match.url}/:id`} component={ProjectDetail} />
    </Switch>
  </div>
);

export default Routes;
