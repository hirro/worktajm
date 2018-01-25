import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaArrowLeft } from 'react-icons/lib/fa';

import { getEntity } from './domain.reducer';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface IDomainDetailProps {
  getEntity: ICrudGetAction;
  domain: any;
  match: any;
}

export class DomainDetail extends React.Component<IDomainDetailProps> {

  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { domain } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="worktajmApp.domain.detail.title">Domain</Translate> [<b>{domain.id}</b>]
        </h2>
        <dl className="row-md jh-entity-details">
          <dt>
            <Translate contentKey="worktajmApp.domain.name">
              name
            </Translate>
          </dt>
          <dd>
            {domain.name}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.domain.address">
              Address
            </Translate>
          </dt>
          <dd>
                          TODO
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.domain.authorizedUsers">
              Authorized Users
            </Translate>
          </dt>
          <dd>
                      TODO
          </dd>
        </dl>
        <Button tag={Link} to="/domain" replace color="info">
          <FaArrowLeft/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.back">Back</Translate></span>
        </Button>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
    domain: storeState.domain.entity
});

const mapDispatchToProps = { getEntity };

export default connect(mapStateToProps, mapDispatchToProps)(DomainDetail);
