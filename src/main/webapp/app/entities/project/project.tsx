import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaPlus, FaEye, FaPencil, FaTrash } from 'react-icons/lib/fa';

import {
  getusers,
  getcustomers,
  getEntities
} from './project.reducer';
 // tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface IProjectProps {
  getEntities: ICrudGetAction;
  projects: any[];
  getusers: ICrudGetAction;
  getcustomers: ICrudGetAction;
  match: any;
}

export class Project extends React.Component<IProjectProps, undefined> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getEntities();
    this.props.getusers();
    this.props.getcustomers();
  }

  render() {
    const { projects, match } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="worktajmApp.project.home.title">Projects</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity">
            <FaPlus /> <Translate contentKey="worktajmApp.project.home.createLabel" />
          </Link>
        </h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th><Translate contentKey="global.field.id">ID</Translate></th>
                <th ><Translate contentKey="worktajmApp.project.name">Name</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.project.description">Description</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.project.hourlyRate">Hourly Rate</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.project.customer">Customer</Translate> <span className="fa fa-sort"/></th>
                <th />
              </tr>
            </thead>
            <tbody>
              {
                projects.map((project, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${project.id}`} color="link" size="sm">
                      {project.id}
                    </Button>
                  </td>
                  <td>
                    {project.name}
                  </td>
                  <td>
                    {project.description}
                  </td>
                  <td>
                    {project.hourlyRate}
                  </td>
                  <td>
                    TODO
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${project.id}`} color="info" size="sm">
                        <FaEye/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.view" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${project.id}/edit`} color="primary" size="sm">
                        <FaPencil/> <span className="d-none d-md-inline"><Translate contentKey="entity.action.edit" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${project.id}/delete`} color="danger" size="sm">
                        <FaTrash/> <span className="d-none d-md-inline"><Translate contentKey="entity.action.delete" /></span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
  projects: storeState.project.entities
});

const mapDispatchToProps = { getusers, getcustomers, getEntities };

export default connect(mapStateToProps, mapDispatchToProps)(Project);
