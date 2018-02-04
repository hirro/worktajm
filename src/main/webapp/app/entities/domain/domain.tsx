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
  getcustomers,
  getusers,
  getSearchEntities,
  getEntities
} from './domain.reducer';
 // tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface IDomainProps {
  getEntities: ICrudGetAction;
  getSearchEntities: ICrudGetAction;
  domains: any[];
  getaddresses: ICrudGetAction;
  getcustomers: ICrudGetAction;
  getusers: ICrudGetAction;
  match: any;
}

export interface IDomainState {
  search: string;
}

export class Domain extends React.Component<IDomainProps, IDomainState> {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
  }

  componentDidMount() {
    this.props.getEntities();
    this.props.getaddresses();
    this.props.getcustomers();
    this.props.getusers();
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
    const { domains, match } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="worktajmApp.domain.home.title">Domains</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity">
            <FaPlus /> <Translate contentKey="worktajmApp.domain.home.createLabel" />
          </Link>
        </h2>
        <div className="row">
          <div className="col-sm-12">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                <InputGroup>
                  <AvInput type="text" name="search" value={this.state.search} onChange={this.handleSearch} placeholder={translate('worktajmApp.domain.home.search')} />
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
                <th ><Translate contentKey="worktajmApp.domain.name">Name</Translate> <span className="fa fa-sort"/></th>
                <th ><Translate contentKey="worktajmApp.domain.address">Address</Translate> <span className="fa fa-sort"/></th>
                <th />
              </tr>
            </thead>
            <tbody>
              {
                domains.map((domain, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${domain.id}`} color="link" size="sm">
                      {domain.id}
                    </Button>
                  </td>
                  <td>
                    {domain.name}
                  </td>
                  <td>
                    {domain.addressAddressLine1 ?
                    <Link to={`address/${domain.addressId}`}>
                      {domain.addressAddressLine1}
                    </Link> : ''}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${domain.id}`} color="info" size="sm">
                        <FaEye/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.view" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${domain.id}/edit`} color="primary" size="sm">
                        <FaPencil/> <span className="d-none d-md-inline"><Translate contentKey="entity.action.edit" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${domain.id}/delete`} color="danger" size="sm">
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
  domains: storeState.domain.entities
});

const mapDispatchToProps = { getaddresses, getcustomers, getusers, getSearchEntities, getEntities };

export default connect(mapStateToProps, mapDispatchToProps)(Domain);
