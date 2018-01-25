import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Translate, ICrudGetAction, ICrudPutAction } from 'react-jhipster';
import { FaBan, FaFloppyO } from 'react-icons/lib/fa';

import { getEntity, updateEntity, createEntity } from './domain.reducer';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from '../../shared/util/date-utils';

export interface IDomainDialogProps {
  getEntity: ICrudGetAction;
  updateEntity: ICrudPutAction;
  createEntity: ICrudPutAction;
  loading: boolean;
  updating: boolean;
  domain: any;
  addresses: any[];
  customers: any[];
  users: any[];
  match: any;
  history: any;
}

export interface IDomainDialogState {
  showModal: boolean;
  isNew: boolean;
  idAddress: number;
  idCustomers: number;
  idsAuthorizedUsers: any[];
}

export class DomainDialog extends React.Component<IDomainDialogProps, IDomainDialogState> {

  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id,
      idAddress: 0,
      idCustomers: 0,
      idsAuthorizedUsers: [],
      showModal: true
    };
    this.updateAuthorizedUsers = this.updateAuthorizedUsers.bind(this);
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
    this.props.history.push('/domain');
  }

  updateAuthorizedUsers(element) {
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
        idsAuthorizedUsers: list
    });
  }

  displayAuthorizedUsers(value: any) {
    if (this.state.idsAuthorizedUsers && this.state.idsAuthorizedUsers.length !== 0) {
        const list = [];
        for (const i in this.state.idsAuthorizedUsers) {
            if (this.state.idsAuthorizedUsers[i]) {
                list.push(this.state.idsAuthorizedUsers[i].email);
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
    const { domain, addresses, customers, users, loading, updating } = this.props;
    const { showModal, isNew } = this.state;
    return (
      <Modal isOpen={showModal} modalTransition={{ timeout: 20 }} backdropTransition={{ timeout: 10 }}
        toggle={this.handleClose} size="lg">
      <ModalHeader toggle={this.handleClose}>
        <Translate contentKey="worktajmApp.domain.home.createOrEditLabel">Create or edit a Domain</Translate>
      </ModalHeader>
      { loading ? <p>Loading...</p>
      : <AvForm model={isNew ? {} : domain} onSubmit={this.saveEntity} >
          <ModalBody>
            { domain.id ?
              <AvGroup>
                <Label for="id"><Translate contentKey="global.field.id">ID</Translate></Label>
                <AvInput type="text" className="form-control" name="id" required readOnly/>
              </AvGroup>
              : null
            }
            <AvGroup>
              <Label for="name">
                <Translate contentKey="worktajmApp.domain.name">
                  name
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="name" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <div className="form-group">
                TODO 4
            </div>
            <AvGroup>
              <Label for="users"><Translate contentKey="worktajmApp.domain.authorizedUsers">AuthorizedUsers</Translate></Label>
              <AvInput type="select"
                multiple
                className="form-control"
                name="fakeusers"
                value={this.displayAuthorizedUsers(domain)}
                onChange={this.updateAuthorizedUsers}>
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
                value={this.state.idsAuthorizedUsers}
              />
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
  domain: storeState.domain.entity,
  addresses: storeState.domain.addresses,
  customers: storeState.domain.customers,
  users: storeState.domain.users,
  loading: storeState.domain.loading,
  updating: storeState.domain.updating
});

const mapDispatchToProps = { getEntity, updateEntity, createEntity };

export default connect(mapStateToProps, mapDispatchToProps)(DomainDialog);
