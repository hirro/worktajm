import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, UncontrolledTooltip } from 'reactstrap';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaArrowLeft } from 'react-icons/lib/fa';

import { getEntity } from './address.reducer';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface IAddressDetailProps {
  getEntity: ICrudGetAction;
  address: any;
  match: any;
}

export class AddressDetail extends React.Component<IAddressDetailProps> {

  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { address } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="worktajmApp.address.detail.title">Address</Translate> [<b>{address.id}</b>]
        </h2>
        <dl className="row-md jh-entity-details">
          <dt>
            <span id="organizationNumber">
              <Translate contentKey="worktajmApp.address.organizationNumber">
              organizationNumber
              </Translate>
            </span>
            <UncontrolledTooltip target="organizationNumber">
              <Translate contentKey="worktajmApp.address.help.organizationNumber"/>
            </UncontrolledTooltip>
          </dt>
          <dd>
            {address.organizationNumber}
          </dd>
          <dt>
            <span id="addressLine1">
              <Translate contentKey="worktajmApp.address.addressLine1">
              addressLine1
              </Translate>
            </span>
          </dt>
          <dd>
            {address.addressLine1}
          </dd>
          <dt>
            <span id="addressLine2">
              <Translate contentKey="worktajmApp.address.addressLine2">
              addressLine2
              </Translate>
            </span>
          </dt>
          <dd>
            {address.addressLine2}
          </dd>
          <dt>
            <span id="addressLine3">
              <Translate contentKey="worktajmApp.address.addressLine3">
              addressLine3
              </Translate>
            </span>
          </dt>
          <dd>
            {address.addressLine3}
          </dd>
          <dt>
            <span id="city">
              <Translate contentKey="worktajmApp.address.city">
              city
              </Translate>
            </span>
          </dt>
          <dd>
            {address.city}
          </dd>
          <dt>
            <span id="zipOrPostcode">
              <Translate contentKey="worktajmApp.address.zipOrPostcode">
              zipOrPostcode
              </Translate>
            </span>
          </dt>
          <dd>
            {address.zipOrPostcode}
          </dd>
          <dt>
            <span id="stateProvinceCounty">
              <Translate contentKey="worktajmApp.address.stateProvinceCounty">
              stateProvinceCounty
              </Translate>
            </span>
          </dt>
          <dd>
            {address.stateProvinceCounty}
          </dd>
          <dt>
            <span id="country">
              <Translate contentKey="worktajmApp.address.country">
              country
              </Translate>
            </span>
          </dt>
          <dd>
            {address.country}
          </dd>
          <dt>
            <span id="addressDetails">
              <Translate contentKey="worktajmApp.address.addressDetails">
              addressDetails
              </Translate>
            </span>
          </dt>
          <dd>
            {address.addressDetails}
          </dd>
        </dl>
        <Button tag={Link} to="/address" replace color="info">
          <FaArrowLeft/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.back">Back</Translate></span>
        </Button>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
    address: storeState.address.entity
});

const mapDispatchToProps = { getEntity };

export default connect(mapStateToProps, mapDispatchToProps)(AddressDetail);
