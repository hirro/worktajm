import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaPlus, FaEye, FaPencil, FaTrash } from 'react-icons/lib/fa';

import {
  getprojects,
  getusers,
  getEntities
} from './time-entry.reducer';
 // tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface ITimeEntryProps {
  getEntities: ICrudGetAction;
  timeEntries: any[];
  getprojects: ICrudGetAction;
  getusers: ICrudGetAction;
  match: any;
}

export class TimeEntry extends React.Component<ITimeEntryProps, undefined> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getEntities();
    this.props.getprojects();
    this.props.getusers();
  }

  render() {
    const { timeEntries, match } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="worktajmApp.timeEntry.home.title">Time Entries</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity">
            <FaPlus /> <Translate contentKey="worktajmApp.timeEntry.home.createLabel" />
          </Link>
        </h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th><Translate contentKey="global.field.id">ID</Translate></th>
                <th ><Translate contentKey="worktajmApp.timeEntry.start">Start</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.timeEntry.end">End</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.timeEntry.comment">Comment</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.timeEntry.project">Project</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.timeEntry.user">User</Translate> <span className="fa fa-sort"/></th>
                <th />
              </tr>
            </thead>
            <tbody>
              {
                timeEntries.map((timeEntry, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${timeEntry.id}`} color="link" size="sm">
                      {timeEntry.id}
                    </Button>
                  </td>
                  <td>
                    <TextFormat type="date" value={timeEntry.start} format={APP_DATE_FORMAT} />
                  </td>
                  <td>
                    <TextFormat type="date" value={timeEntry.end} format={APP_DATE_FORMAT} />
                  </td>
                  <td>
                    {timeEntry.comment}
                  </td>
                  <td>
                    TODO
                  </td>
                  <td>
                    TODO
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${timeEntry.id}`} color="info" size="sm">
                        <FaEye/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.view" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${timeEntry.id}/edit`} color="primary" size="sm">
                        <FaPencil/> <span className="d-none d-md-inline"><Translate contentKey="entity.action.edit" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${timeEntry.id}/delete`} color="danger" size="sm">
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
  timeEntries: storeState.timeEntry.entities
});

const mapDispatchToProps = { getprojects, getusers, getEntities };

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntry);
