import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, InputGroup } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaPlus, FaEye, FaPencil, FaTrash, FaSearch } from 'react-icons/lib/fa';

import {
  getaddresses,
  getprojects,
  getdomains,
  getSearchEntities,
  getEntities
} from './customer.reducer';
 // tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface ICustomerProps {
  getEntities: ICrudGetAction;
  getSearchEntities: ICrudGetAction;
  customers: any[];
  getaddresses: ICrudGetAction;
  getprojects: ICrudGetAction;
  getdomains: ICrudGetAction;
  match: any;
}

export interface ICustomerState {
  search: string;
}

export class Customer extends React.Component<ICustomerProps, ICustomerState> {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
  }

  componentDidMount() {
    this.props.getEntities();
    this.props.getaddresses();
    this.props.getprojects();
    this.props.getdomains();
  }

  search = () => {
    if (this.state.search) {
      this.props.getSearchEntities(this.state.search);
    }
  }

  clear = () => {
    this.props.getEntities();
    this.setState({
      search: ''
    });
  }

  handleSearch = event => this.setState({ search: event.target.value });

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
        <div className="row">
          <div className="col-sm-12">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                <InputGroup>
                  <AvInput type="text" name="search" value={this.state.search} onChange={this.handleSearch} placeholder={translate('worktajmApp.customer.home.search')} />
                  <Button className="input-group-addon">
                    <FaSearch/>
                  </Button>
                  <Button type="reset" className="input-group-addon" onClick={this.clear}>
                    <FaTrash/>
                  </Button>
                </InputGroup>
              </AvGroup>
            </AvForm>
          </div>
        </div>
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
                    {customer.addressAddressLine1 ?
                    <Link to={`address/${customer.addressId}`}>
                      {customer.addressAddressLine1}
                    </Link> : ''}
                  </td>
                  <td>
                    {customer.domainName ?
                    <Link to={`domain/${customer.domainId}`}>
                      {customer.domainName}
                    </Link> : ''}
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

const mapDispatchToProps = { getaddresses, getprojects, getdomains, getSearchEntities, getEntities };

export default connect(mapStateToProps, mapDispatchToProps)(Customer);
