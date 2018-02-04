import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, UncontrolledTooltip } from 'reactstrap';
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
            <span id="name">
              <Translate contentKey="worktajmApp.domain.name">
              name
              </Translate>
            </span>
            <UncontrolledTooltip target="name">
              <Translate contentKey="worktajmApp.domain.help.name"/>
            </UncontrolledTooltip>
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
              {domain.addressAddressLine1 ? domain.addressAddressLine1 : ''}
          </dd>
          <dt>
            <Translate contentKey="worktajmApp.domain.authorizedUsers">
              Authorized Users
            </Translate>
          </dt>
          <dd>
  {
    (domain.authorizedUsers) ?
        (domain.authorizedUsers.map((val, i) =>
            <span key={val.id}><a>{val.email}</a>{(i === domain.authorizedUsers.length - 1) ? '' : ', '}</span>
        )
    ) : null
  }
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
