import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, UncontrolledTooltip } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Translate, ICrudGetAction, ICrudPutAction } from 'react-jhipster';
import { FaBan, FaFloppyO } from 'react-icons/lib/fa';

import { getEntity, updateEntity, createEntity } from './time-entry.reducer';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from '../../shared/util/date-utils';

export interface ITimeEntryDialogProps {
  getEntity: ICrudGetAction;
  updateEntity: ICrudPutAction;
  createEntity: ICrudPutAction;
  loading: boolean;
  updating: boolean;
  timeEntry: any;
  projects: any[];
  users: any[];
  match: any;
  history: any;
}

export interface ITimeEntryDialogState {
  showModal: boolean;
  isNew: boolean;
  projectId: number;
  userId: number;
}

export class TimeEntryDialog extends React.Component<ITimeEntryDialogProps, ITimeEntryDialogState> {

  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id,
      projectId: 0,
      userId: 0,
      showModal: true
    };
  }

  componentDidMount() {
    !this.state.isNew && this.props.getEntity(this.props.match.params.id);
  }

  saveEntity = (event, errors, values) => {
    values.start = new Date(values.start);
    values.end = new Date(values.end);
    if (this.state.isNew) {
      this.props.createEntity(values);
    } else {
      this.props.updateEntity(values);
    }
    this.handleClose();
  }

  handleClose = () => {
    this.setState({
        showModal: false
    });
    this.props.history.push('/time-entry');
  }

  projectUpdate = element => {
    const name = element.target.value;
    for (const i in this.props.projects) {
        if (name.toString() === this.props.projects[i].name.toString()) {
            this.setState({
                projectId: this.props.projects[i].id
            });
        }
    }
  }

  userUpdate = element => {
    const email = element.target.value;
    for (const i in this.props.users) {
        if (email.toString() === this.props.users[i].email.toString()) {
            this.setState({
                userId: this.props.users[i].id
            });
        }
    }
  }

  render() {
    const isInvalid = false;
    const { timeEntry, projects, users, loading, updating } = this.props;
    const { showModal, isNew } = this.state;
    return (
      <Modal isOpen={showModal} modalTransition={{ timeout: 20 }} backdropTransition={{ timeout: 10 }}
        toggle={this.handleClose} size="lg">
      <ModalHeader toggle={this.handleClose}>
        <Translate contentKey="worktajmApp.timeEntry.home.createOrEditLabel">Create or edit a TimeEntry</Translate>
      </ModalHeader>
      { loading ? <p>Loading...</p>
      : <AvForm model={isNew ? {} : timeEntry} onSubmit={this.saveEntity} >
          <ModalBody>
            { timeEntry.id ?
              <AvGroup>
                <Label for="id"><Translate contentKey="global.field.id">ID</Translate></Label>
                <AvInput type="text" className="form-control" name="id" required readOnly/>
              </AvGroup>
              : null
            }
            <AvGroup>
              <Label id="startLabel" for="start">
                <Translate contentKey="worktajmApp.timeEntry.start">
                  start
                </Translate>
              </Label>
              <AvInput
                type="datetime-local" className="form-control" name="start"
                value={convertDateTimeFromServer(this.props.timeEntry.start)} required
              />
              <AvFeedback>This field is required.</AvFeedback>
            <UncontrolledTooltip target="startLabel">
              <Translate contentKey="worktajmApp.timeEntry.help.start"/>
            </UncontrolledTooltip>
            </AvGroup>
            <AvGroup>
              <Label id="endLabel" for="end">
                <Translate contentKey="worktajmApp.timeEntry.end">
                  end
                </Translate>
              </Label>
              <AvInput
                type="datetime-local" className="form-control" name="end"
                value={convertDateTimeFromServer(this.props.timeEntry.end)} required
              />
              <AvFeedback>This field is required.</AvFeedback>
            <UncontrolledTooltip target="endLabel">
              <Translate contentKey="worktajmApp.timeEntry.help.end"/>
            </UncontrolledTooltip>
            </AvGroup>
            <AvGroup>
              <Label id="commentLabel" for="comment">
                <Translate contentKey="worktajmApp.timeEntry.comment">
                  comment
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="comment" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            <UncontrolledTooltip target="commentLabel">
              <Translate contentKey="worktajmApp.timeEntry.help.comment"/>
            </UncontrolledTooltip>
            </AvGroup>
            <AvGroup>
              <Label for="project.name">
                <Translate contentKey="worktajmApp.timeEntry.project">Project</Translate>
              </Label>
                  <AvInput type="select"
                    className="form-control"
                    name="projectId"
                    onChange={this.projectUpdate}>
                    {
                      projects.map(otherEntity =>
                        <option
                          value={otherEntity.id}
                          key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      )
                    }
                  </AvInput>
            </AvGroup>
            <AvGroup>
              <Label for="user.email">
                <Translate contentKey="worktajmApp.timeEntry.user">User</Translate>
              </Label>
                  <AvInput type="select"
                    className="form-control"
                    name="userId"
                    onChange={this.userUpdate}>
                    {
                      users.map(otherEntity =>
                        <option
                          value={otherEntity.id}
                          key={otherEntity.id}>
                          {otherEntity.email}
                        </option>
                      )
                    }
                  </AvInput>
            </AvGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClose}>
              <FaBan/>&nbsp;
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>
            <Button color="primary" type="submit" disabled={isInvalid || updating}>
              <FaFloppyO/>&nbsp;
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
          </ModalFooter>
        </AvForm>
      }
    </Modal>
    );
  }
}

const mapStateToProps = storeState => ({
  timeEntry: storeState.timeEntry.entity,
  projects: storeState.timeEntry.projects,
  users: storeState.timeEntry.users,
  loading: storeState.timeEntry.loading,
  updating: storeState.timeEntry.updating
});

const mapDispatchToProps = { getEntity, updateEntity, createEntity };

export default connect(mapStateToProps, mapDispatchToProps)(TimeEntryDialog);
