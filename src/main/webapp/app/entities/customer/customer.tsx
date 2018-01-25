import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaPlus, FaEye, FaPencil, FaTrash } from 'react-icons/lib/fa';

import {
  getaddresses,
  getprojects,
  getdomains,
  getEntities
} from './customer.reducer';
 // tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface ICustomerProps {
  getEntities: ICrudGetAction;
  customers: any[];
  getaddresses: ICrudGetAction;
  getprojects: ICrudGetAction;
  getdomains: ICrudGetAction;
  match: any;
}

export class Customer extends React.Component<ICustomerProps, undefined> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getEntities();
    this.props.getaddresses();
    this.props.getprojects();
    this.props.getdomains();
  }

  render() {
    const { customers, match } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="worktajmApp.customer.home.title">Customers</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity">
            <FaPlus /> <Translate contentKey="worktajmApp.customer.home.createLabel" />
          </Link>
        </h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th><Translate contentKey="global.field.id">ID</Translate></th>
                <th ><Translate contentKey="worktajmApp.customer.name">Name</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.customer.address">Address</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.customer.domain">Domain</Translate> <span className="fa fa-sort"/></th>
                <th />
              </tr>
            </thead>
            <tbody>
              {
                customers.map((customer, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${customer.id}`} color="link" size="sm">
                      {customer.id}
                    </Button>
                  </td>
                  <td>
                    {customer.name}
                  </td>
                  <td>
                    TODO
                  </td>
                  <td>
                    TODO
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${customer.id}`} color="info" size="sm">
                        <FaEye/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.view" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${customer.id}/edit`} color="primary" size="sm">
                        <FaPencil/> <span className="d-none d-md-inline"><Translate contentKey="entity.action.edit" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${customer.id}/delete`} color="danger" size="sm">
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
  customers: storeState.customer.entities
});

const mapDispatchToProps = { getaddresses, getprojects, getdomains, getEntities };

export default connect(mapStateToProps, mapDispatchToProps)(Customer);
