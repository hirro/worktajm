import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, InputGroup } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaPlus, FaEye, FaPencil, FaTrash, FaSearch } from 'react-icons/lib/fa';

import {
  getprojects,
  getusers,
  getSearchEntities,
  getEntities
} from './time-entry.reducer';
 // tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface ITimeEntryProps {
  getEntities: ICrudGetAction;
  getSearchEntities: ICrudGetAction;
  timeEntries: any[];
  getprojects: ICrudGetAction;
  getusers: ICrudGetAction;
  match: any;
}

export interface ITimeEntryState {
  search: string;
}

export class TimeEntry extends React.Component<ITimeEntryProps, ITimeEntryState> {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
  }

  componentDidMount() {
    this.props.getEntities();
    this.props.getprojects();
    this.props.getusers();
  }

  search = () => {
    if (this.state.search) {
      this.props.getSearchEntities(this.state.search);
    }
  }

  clear = () => {
    this.props.getEntities();
    this.setState({
      search: ''
    });
  }

  handleSearch = event => this.setState({ search: event.target.value });

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
        <div className="row">
          <div className="col-sm-12">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                <InputGroup>
                  <AvInput type="text" name="search" value={this.state.search} onChange={this.handleSearch} placeholder={translate('worktajmApp.timeEntry.home.search')} />
                  <Button className="input-group-addon">
                    <FaSearch/>
                  </Button>
                  <Button type="reset" className="input-group-addon" onClick={this.clear}>
                    <FaTrash/>
                  </Button>
                </InputGroup>
              </AvGroup>
            </AvForm>
          </div>
        </div>
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
                    {timeEntry.projectName ?
                    <Link to={`project/${timeEntry.projectId}`}>
                      {timeEntry.projectName}
                    </Link> : ''}
                  </td>
                  <td>
                    {timeEntry.userEmail ? timeEntry.userEmail : ''}
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

const mapDispatchToProps = { getprojects, getusers, getSearchEntities, getEntities };

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntry);
