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
  getcustomers,
  getusers,
  getEntities
} from './domain.reducer';
 // tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface IDomainProps {
  getEntities: ICrudGetAction;
  domains: any[];
  getaddresses: ICrudGetAction;
  getcustomers: ICrudGetAction;
  getusers: ICrudGetAction;
  match: any;
}

export class Domain extends React.Component<IDomainProps, undefined> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getEntities();
    this.props.getaddresses();
    this.props.getcustomers();
    this.props.getusers();
  }

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
                    TODO
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

const mapDispatchToProps = { getaddresses, getcustomers, getusers, getEntities };

export default connect(mapStateToProps, mapDispatchToProps)(Domain);
