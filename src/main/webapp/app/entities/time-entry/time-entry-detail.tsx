import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaArrowLeft } from 'react-icons/lib/fa';

import { getEntity } from './time-entry.reducer';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface ITimeEntryDetailProps {
  getEntity: ICrudGetAction;
  timeEntry: any;
  match: any;
}

export class TimeEntryDetail extends React.Component<ITimeEntryDetailProps> {

  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { timeEntry } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="worktajmApp.timeEntry.detail.title">TimeEntry</Translate> [<b>{timeEntry.id}</b>]
        </h2>
        <dl className="row-md jh-entity-details">
          <dt>
            <Translate contentKey="worktajmApp.timeEntry.start">
              start
            </Translate>
          </dt>
          <dd>
            <TextFormat value={timeEntry.start} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.timeEntry.end">
              end
            </Translate>
          </dt>
          <dd>
            <TextFormat value={timeEntry.end} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.timeEntry.comment">
              comment
            </Translate>
          </dt>
          <dd>
            {timeEntry.comment}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.timeEntry.project">
              Project
            </Translate>
          </dt>
          <dd>
                          TODO
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.timeEntry.user">
              User
            </Translate>
          </dt>
          <dd>
                              TODO
          </dd>
        </dl>
        <Button tag={Link} to="/time-entry" replace color="info">
          <FaArrowLeft/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.back">Back</Translate></span>
        </Button>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
    timeEntry: storeState.timeEntry.entity
});

const mapDispatchToProps = { getEntity };

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntryDetail);
