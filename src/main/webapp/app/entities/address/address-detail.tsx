import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
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
            <Translate contentKey="worktajmApp.address.organizationNumber">
              organizationNumber
            </Translate>
          </dt>
          <dd>
            {address.organizationNumber}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.address.addressLine1">
              addressLine1
            </Translate>
          </dt>
          <dd>
            {address.addressLine1}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.address.addressLine2">
              addressLine2
            </Translate>
          </dt>
          <dd>
            {address.addressLine2}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.address.addressLine3">
              addressLine3
            </Translate>
          </dt>
          <dd>
            {address.addressLine3}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.address.city">
              city
            </Translate>
          </dt>
          <dd>
            {address.city}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.address.zipOrPostcode">
              zipOrPostcode
            </Translate>
          </dt>
          <dd>
            {address.zipOrPostcode}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.address.stateProvinceCounty">
              stateProvinceCounty
            </Translate>
          </dt>
          <dd>
            {address.stateProvinceCounty}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.address.country">
              country
            </Translate>
          </dt>
          <dd>
            {address.country}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.address.addressDetails">
              addressDetails
            </Translate>
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
