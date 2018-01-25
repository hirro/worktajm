import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaPlus, FaEye, FaPencil, FaTrash } from 'react-icons/lib/fa';

import {
  getEntities
} from './address.reducer';
 // tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface IAddressProps {
  getEntities: ICrudGetAction;
  addresses: any[];
  match: any;
}

export class Address extends React.Component<IAddressProps, undefined> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { addresses, match } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="worktajmApp.address.home.title">Addresses</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity">
            <FaPlus /> <Translate contentKey="worktajmApp.address.home.createLabel" />
          </Link>
        </h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th><Translate contentKey="global.field.id">ID</Translate></th>
                <th ><Translate contentKey="worktajmApp.address.organizationNumber">Organization Number</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.address.addressLine1">Address Line 1</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.address.addressLine2">Address Line 2</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.address.addressLine3">Address Line 3</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.address.city">City</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.address.zipOrPostcode">Zip Or Postcode</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.address.stateProvinceCounty">State Province County</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.address.country">Country</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.address.addressDetails">Address Details</Translate> <span className="fa fa-sort"/></th>
                <th />
              </tr>
            </thead>
            <tbody>
              {
                addresses.map((address, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${address.id}`} color="link" size="sm">
                      {address.id}
                    </Button>
                  </td>
                  <td>
                    {address.organizationNumber}
                  </td>
                  <td>
                    {address.addressLine1}
                  </td>
                  <td>
                    {address.addressLine2}
                  </td>
                  <td>
                    {address.addressLine3}
                  </td>
                  <td>
                    {address.city}
                  </td>
                  <td>
                    {address.zipOrPostcode}
                  </td>
                  <td>
                    {address.stateProvinceCounty}
                  </td>
                  <td>
                    {address.country}
                  </td>
                  <td>
                    {address.addressDetails}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${address.id}`} color="info" size="sm">
                        <FaEye/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.view" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${address.id}/edit`} color="primary" size="sm">
                        <FaPencil/> <span className="d-none d-md-inline"><Translate contentKey="entity.action.edit" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${address.id}/delete`} color="danger" size="sm">
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
  addresses: storeState.address.entities
});

const mapDispatchToProps = { getEntities };

export default connect(mapStateToProps, mapDispatchToProps)(Address);
