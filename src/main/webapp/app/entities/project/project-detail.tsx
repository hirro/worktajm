import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, UncontrolledTooltip } from 'reactstrap';
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
            <span id="name">
              <Translate contentKey="worktajmApp.project.name">
              name
              </Translate>
            </span>
            <UncontrolledTooltip target="name">
              <Translate contentKey="worktajmApp.project.help.name"/>
            </UncontrolledTooltip>
          </dt>
          <dd>
            {project.name}
          </dd>
          <dt>
            <span id="description">
              <Translate contentKey="worktajmApp.project.description">
              description
              </Translate>
            </span>
            <UncontrolledTooltip target="description">
              <Translate contentKey="worktajmApp.project.help.description"/>
            </UncontrolledTooltip>
          </dt>
          <dd>
            {project.description}
          </dd>
          <dt>
            <span id="hourlyRate">
              <Translate contentKey="worktajmApp.project.hourlyRate">
              hourlyRate
              </Translate>
            </span>
            <UncontrolledTooltip target="hourlyRate">
              <Translate contentKey="worktajmApp.project.help.hourlyRate"/>
            </UncontrolledTooltip>
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
  {
    (project.projectMembers) ?
        (project.projectMembers.map((val, i) =>
            <span key={val.id}><a>{val.email}</a>{(i === project.projectMembers.length - 1) ? '' : ', '}</span>
        )
    ) : null
  }          </dd>
          <dt>
            <Translate contentKey="worktajmApp.project.customer">
              Customer
            </Translate>
          </dt>
          <dd>
              {project.customerName ? project.customerName : ''}
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
