import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Translate, ICrudGetAction, ICrudPutAction } from 'react-jhipster';
import { FaBan, FaFloppyO } from 'react-icons/lib/fa';

import { getEntity, updateEntity, createEntity } from './project.reducer';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from '../../shared/util/date-utils';

export interface IProjectDialogProps {
  getEntity: ICrudGetAction;
  updateEntity: ICrudPutAction;
  createEntity: ICrudPutAction;
  loading: boolean;
  updating: boolean;
  project: any;
  users: any[];
  customers: any[];
  match: any;
  history: any;
}

export interface IProjectDialogState {
  showModal: boolean;
  isNew: boolean;
  idsProject Members: any[];
  idCustomer: number;
}

export class ProjectDialog extends React.Component<IProjectDialogProps, IProjectDialogState> {

  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id,
      idsProject Members: [],
      idCustomer: 0,
      showModal: true
    };
    this.updateProject Members = this.updateProject Members.bind(this);
    this.updateCustomer = this.updateCustomer.bind(this);
  }

  componentDidMount() {
    !this.state.isNew && this.props.getEntity(this.props.match.params.id);
  }

  saveEntity = (event, errors, values) => {
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
    this.props.history.push('/project');
  }

  updateProject Members(element) {
    const email = element.target.value;
    const list = [];
    for (const i in element.target.selectedOptions) {
        if (element.target.selectedOptions[i]) {
            const prop = element.target.selectedOptions[i].value;
            for (const j in this.props.users) {
                if (prop === this.props.users[j].email) {
                    list.push(this.props.users[j]);
                }
            }
        }
    }
    this.setState({
        idsProject Members: list
    });
  }

  updateCustomer(element) {
    const name = element.target.value;
    for (const i in this.props.customers) {
        if (name.toString() === this.props.customers[i].name.toString()) {
            this.setState({
                idCustomer: this.props.customers[i].id
            });
        }
    }
  }

  displayProject Members(value: any) {
    if (this.state.idsProject Members && this.state.idsProject Members.length !== 0) {
        const list = [];
        for (const i in this.state.idsProject Members) {
            if (this.state.idsProject Members[i]) {
                list.push(this.state.idsProject Members[i].email);
            }
        }
        return list;
    }
    if (value.users && value.users.length !== 0) {
        const list = [];
        for (const i in value.users) {
            if (value.users[i]) {
                list.push(value.users[i].email);
            }
        }
        return list;
    }
    return null;
  }

  render() {
    const isInvalid = false;
    const { project, users, customers, loading, updating } = this.props;
    const { showModal, isNew } = this.state;
    return (
      <Modal isOpen={showModal} modalTransition={{ timeout: 20 }} backdropTransition={{ timeout: 10 }}
        toggle={this.handleClose} size="lg">
      <ModalHeader toggle={this.handleClose}>
        <Translate contentKey="worktajmApp.project.home.createOrEditLabel">Create or edit a Project</Translate>
      </ModalHeader>
      { loading ? <p>Loading...</p>
      : <AvForm model={isNew ? {} : project} onSubmit={this.saveEntity} >
          <ModalBody>
            { project.id ?
              <AvGroup>
                <Label for="id"><Translate contentKey="global.field.id">ID</Translate></Label>
                <AvInput type="text" className="form-control" name="id" required readOnly/>
              </AvGroup>
              : null
            }
            <AvGroup>
              <Label for="name">
                <Translate contentKey="worktajmApp.project.name">
                  name
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="name" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label for="description">
                <Translate contentKey="worktajmApp.project.description">
                  description
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="description" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label for="hourlyRate">
                <Translate contentKey="worktajmApp.project.hourlyRate">
                  hourlyRate
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="hourlyRate" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label for="users"><Translate contentKey="worktajmApp.project.projectMembers">Project Members</Translate></Label>
              <AvInput type="select"
                multiple
                className="form-control"
                name="fakeusers"
                value={this.displayProject Members(project)}
                onChange={this.updateProject Members}>
                <option value="" key="0" />
                {
                  (users) ? (users.map(otherEntity =>
                  <option
                      value={otherEntity.email}
                      key={otherEntity.id}>
                      {otherEntity.email}
                  </option>
                  )) : null
                }
              </AvInput>
              <AvInput type="hidden"
                name="users"
                value={this.state.idsProject Members}
              />
            </AvGroup>
            <AvGroup>
              <Label for="customer.name">
                <Translate contentKey="worktajmApp.project.customer">Customer</Translate>
              </Label>
                  TODO 3
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
  project: storeState.project.entity,
  users: storeState.project.users,
  customers: storeState.project.customers,
  loading: storeState.project.loading,
  updating: storeState.project.updating
});

const mapDispatchToProps = { getEntity, updateEntity, createEntity };

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDialog);
