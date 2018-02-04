import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Translate, ICrudGetAction, ICrudPutAction } from 'react-jhipster';
import { FaBan, FaFloppyO } from 'react-icons/lib/fa';

import { getEntity, updateEntity, createEntity } from './customer.reducer';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from '../../shared/util/date-utils';

export interface ICustomerDialogProps {
  getEntity: ICrudGetAction;
  updateEntity: ICrudPutAction;
  createEntity: ICrudPutAction;
  loading: boolean;
  updating: boolean;
  customer: any;
  addresses: any[];
  projects: any[];
  domains: any[];
  match: any;
  history: any;
}

export interface ICustomerDialogState {
  showModal: boolean;
  isNew: boolean;
  addressId: number;
  projectsId: number;
  domainId: number;
}

export class CustomerDialog extends React.Component<ICustomerDialogProps, ICustomerDialogState> {

  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id,
      addressId: 0,
      projectsId: 0,
      domainId: 0,
      showModal: true
    };
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
    this.props.history.push('/customer');
  }

  addressUpdate = element => {
    const addressLine1 = element.target.value;
    for (const i in this.props.addresses) {
        if (addressLine1.toString() === this.props.addresses[i].addressLine1.toString()) {
            this.setState({
                addressId: this.props.addresses[i].id
            });
        }
    }
  }

  domainUpdate = element => {
    const name = element.target.value;
    for (const i in this.props.domains) {
        if (name.toString() === this.props.domains[i].name.toString()) {
            this.setState({
                domainId: this.props.domains[i].id
            });
        }
    }
  }

  render() {
    const isInvalid = false;
    const { customer, addresses, projects, domains, loading, updating } = this.props;
    const { showModal, isNew } = this.state;
    return (
      <Modal isOpen={showModal} modalTransition={{ timeout: 20 }} backdropTransition={{ timeout: 10 }}
        toggle={this.handleClose} size="lg">
      <ModalHeader toggle={this.handleClose}>
        <Translate contentKey="worktajmApp.customer.home.createOrEditLabel">Create or edit a Customer</Translate>
      </ModalHeader>
      { loading ? <p>Loading...</p>
      : <AvForm model={isNew ? {} : customer} onSubmit={this.saveEntity} >
          <ModalBody>
            { customer.id ?
              <AvGroup>
                <Label for="id"><Translate contentKey="global.field.id">ID</Translate></Label>
                <AvInput type="text" className="form-control" name="id" required readOnly/>
              </AvGroup>
              : null
            }
            <AvGroup>
              <Label id="nameLabel" for="name">
                <Translate contentKey="worktajmApp.customer.name">
                  name
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="name" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label for="address.addressLine1">
                <Translate contentKey="worktajmApp.customer.address">Address</Translate>
              </Label>
                  <AvInput type="select"
                    className="form-control"
                    name="addressId"
                    onChange={this.addressUpdate}>
                    <option value="" key="0" />
                    {
                      addresses.map(otherEntity =>
                        <option
                          value={otherEntity.id}
                          key={otherEntity.id}>
                          {otherEntity.addressLine1}
                        </option>
                      )
                    }
                  </AvInput>
            </AvGroup>
            <AvGroup>
              <Label for="domain.name">
                <Translate contentKey="worktajmApp.customer.domain">Domain</Translate>
              </Label>
                  <AvInput type="select"
                    className="form-control"
                    name="domainId"
                    onChange={this.domainUpdate}>
                    {
                      domains.map(otherEntity =>
                        <option
                          value={otherEntity.id}
                          key={otherEntity.id}>
                          {otherEntity.name}
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
  customer: storeState.customer.entity,
  addresses: storeState.customer.addresses,
  projects: storeState.customer.projects,
  domains: storeState.customer.domains,
  loading: storeState.customer.loading,
  updating: storeState.customer.updating
});

const mapDispatchToProps = { getEntity, updateEntity, createEntity };

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDialog);
