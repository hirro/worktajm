import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, UncontrolledTooltip } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Translate, ICrudGetAction, ICrudPutAction } from 'react-jhipster';
import { FaBan, FaFloppyO } from 'react-icons/lib/fa';

import { getEntity, updateEntity, createEntity } from './address.reducer';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from '../../shared/util/date-utils';

export interface IAddressDialogProps {
  getEntity: ICrudGetAction;
  updateEntity: ICrudPutAction;
  createEntity: ICrudPutAction;
  loading: boolean;
  updating: boolean;
  address: any;
  match: any;
  history: any;
}

export interface IAddressDialogState {
  showModal: boolean;
  isNew: boolean;
}

export class AddressDialog extends React.Component<IAddressDialogProps, IAddressDialogState> {

  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id,
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
    this.props.history.push('/address');
  }

  render() {
    const isInvalid = false;
    const { address, loading, updating } = this.props;
    const { showModal, isNew } = this.state;
    return (
      <Modal isOpen={showModal} modalTransition={{ timeout: 20 }} backdropTransition={{ timeout: 10 }}
        toggle={this.handleClose} size="lg">
      <ModalHeader toggle={this.handleClose}>
        <Translate contentKey="worktajmApp.address.home.createOrEditLabel">Create or edit a Address</Translate>
      </ModalHeader>
      { loading ? <p>Loading...</p>
      : <AvForm model={isNew ? {} : address} onSubmit={this.saveEntity} >
          <ModalBody>
            { address.id ?
              <AvGroup>
                <Label for="id"><Translate contentKey="global.field.id">ID</Translate></Label>
                <AvInput type="text" className="form-control" name="id" required readOnly/>
              </AvGroup>
              : null
            }
            <AvGroup>
              <Label id="organizationNumberLabel" for="organizationNumber">
                <Translate contentKey="worktajmApp.address.organizationNumber">
                  organizationNumber
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="organizationNumber" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            <UncontrolledTooltip target="organizationNumberLabel">
              <Translate contentKey="worktajmApp.address.help.organizationNumber"/>
            </UncontrolledTooltip>
            </AvGroup>
            <AvGroup>
              <Label id="addressLine1Label" for="addressLine1">
                <Translate contentKey="worktajmApp.address.addressLine1">
                  addressLine1
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="addressLine1" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="addressLine2Label" for="addressLine2">
                <Translate contentKey="worktajmApp.address.addressLine2">
                  addressLine2
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="addressLine2" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="addressLine3Label" for="addressLine3">
                <Translate contentKey="worktajmApp.address.addressLine3">
                  addressLine3
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="addressLine3" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="cityLabel" for="city">
                <Translate contentKey="worktajmApp.address.city">
                  city
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="city" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="zipOrPostcodeLabel" for="zipOrPostcode">
                <Translate contentKey="worktajmApp.address.zipOrPostcode">
                  zipOrPostcode
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="zipOrPostcode" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="stateProvinceCountyLabel" for="stateProvinceCounty">
                <Translate contentKey="worktajmApp.address.stateProvinceCounty">
                  stateProvinceCounty
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="stateProvinceCounty" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="countryLabel" for="country">
                <Translate contentKey="worktajmApp.address.country">
                  country
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="country" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="addressDetailsLabel" for="addressDetails">
                <Translate contentKey="worktajmApp.address.addressDetails">
                  addressDetails
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="addressDetails" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
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
  address: storeState.address.entity,
  loading: storeState.address.loading,
  updating: storeState.address.updating
});

const mapDispatchToProps = { getEntity, updateEntity, createEntity };

export default connect(mapStateToProps, mapDispatchToProps)(AddressDialog);
