import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaArrowLeft } from 'react-icons/lib/fa';

import { getEntity } from './project.reducer';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface IProjectDetailProps {
  getEntity: ICrudGetAction;
  project: any;
  match: any;
}

export class ProjectDetail extends React.Component<IProjectDetailProps> {

  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { project } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="worktajmApp.project.detail.title">Project</Translate> [<b>{project.id}</b>]
        </h2>
        <dl className="row-md jh-entity-details">
          <dt>
            <Translate contentKey="worktajmApp.project.name">
              name
            </Translate>
          </dt>
          <dd>
            {project.name}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.project.description">
              description
            </Translate>
          </dt>
          <dd>
            {project.description}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.project.hourlyRate">
              hourlyRate
            </Translate>
          </dt>
          <dd>
            {project.hourlyRate}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.project.projectMembers">
              Project Members
            </Translate>
          </dt>
          <dd>
                      TODO
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.project.customer">
              Customer
            </Translate>
          </dt>
          <dd>
                          TODO
          </dd>
        </dl>
        <Button tag={Link} to="/project" replace color="info">
          <FaArrowLeft/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.back">Back</Translate></span>
        </Button>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
    project: storeState.project.entity
});

const mapDispatchToProps = { getEntity };

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
