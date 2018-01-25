import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaArrowLeft } from 'react-icons/lib/fa';

import { getEntity } from './customer.reducer';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface ICustomerDetailProps {
  getEntity: ICrudGetAction;
  customer: any;
  match: any;
}

export class CustomerDetail extends React.Component<ICustomerDetailProps> {

  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { customer } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="worktajmApp.customer.detail.title">Customer</Translate> [<b>{customer.id}</b>]
        </h2>
        <dl className="row-md jh-entity-details">
          <dt>
            <Translate contentKey="worktajmApp.customer.name">
              name
            </Translate>
          </dt>
          <dd>
            {customer.name}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.customer.address">
              Address
            </Translate>
          </dt>
          <dd>
                          TODO
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.customer.domain">
              Domain
            </Translate>
          </dt>
          <dd>
                          TODO
          </dd>
        </dl>
        <Button tag={Link} to="/customer" replace color="info">
          <FaArrowLeft/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.back">Back</Translate></span>
        </Button>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
    customer: storeState.customer.entity
});

const mapDispatchToProps = { getEntity };

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);
