// @flow
'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import type grantTypeType from '../../../common/types/grantTypeType';
import type authorityType from '../../../common/types/authorityType';
import type scopeType from '../../../common/types/scopeType';

import isEmpty from 'lodash/isEmpty';

import extractMultiSelectedOptions from '../../utils/form/extractMultiSelectedOptions';

import Modal from 'react-bootstrap/lib/Modal';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup'
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Button from 'react-bootstrap/lib/Button';

import CollapsableAlert from '../../../common/components/CollapsableAlert';

require('bootstrap/dist/css/bootstrap.css');

type EditClientModalState = {
  id: ?number,
  clientId: string,
  secret: string,
  accessTokenValidity: string,
  refreshTokenValidity: string,
  redirectUri: string,
  grantTypes: grantTypeType[],
  authorities: authorityType[],
  scopes: scopeType[],
  errors: {
    clientId: string,
    secret: string,
    accessTokenValidity: string,
    refreshTokenValidity: string,
    redirectUri: string,
    form: string
  },
  isValid: boolean,
  isLoading: boolean
}

class EditClientModal extends Component<EditClientModal.propTypes, EditClientModalState> {
  onChange: () => void;
  handleMultipleSelected: () => void;
  validateForm: () => void;
  onSubmit: () => void;

  constructor(props: EditClientModal.propTypes) {
    super(props);

    this.state = {
      id: null,
      clientId: '',
      secret: '',
      accessTokenValidity: '',
      refreshTokenValidity: '',
      redirectUri: '',
      grantTypes: [],
      allGrantTypes: [],
      authorities: [],
      allAuthorities: [],
      scopes: [],
      allScopes: [],
      errors: {
        clientId: '',
        secret: '',
        accessTokenValidity: '',
        refreshTokenValidity: '',
        redirectUri: '',
        form: ''
      },
      isValid: false,
      isLoading: false
    }

    this.onChange = this.onChange.bind(this);
    this.handleMultipleSelected = this.handleMultipleSelected.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    // TODO: Join streams
    this.props.loadGrantTypes().then(
      response => this.setState({allGrantTypes: response.data.content}),
      error => this.setState({errors: {form: error.response.message}})
    );

    this.props.loadAuthorities().then(
      response => this.setState({allAuthorities: response.data.content}),
      error => this.setState({errors: {form: error.response.message}})
    );

    this.props.loadScopes().then(
      response => this.setState({allScopes: response.data.content}),
      error => this.setState({errors: {form: error.response.message}})
    );
  }

  onChange(event: SyntheticInputEvent<HTMLInputElement>) {
    if (event.target.type === 'select-multiple') {
      this.handleMultipleSelected(event.target);
    } else {
      this.setState({[event.target.name]: event.target.value}, this.validateForm);
    }
  }

  handleMultipleSelected(eventTarget: HTMLSelectElement) {
    const {allGrantTypes, allAuthorities, allScopes} = this.state;

    switch (eventTarget.name) {
      case 'grantTypes':
        extractMultiSelectedOptions(eventTarget, allGrantTypes, (selectedGrantTypes) => {
          this.setState({grantTypes: selectedGrantTypes}, this.validateForm);
        });
        break;
      case 'authorities':
        extractMultiSelectedOptions(eventTarget, allAuthorities, (selectedAuthorities) => {
          this.setState({authorities: selectedAuthorities}, this.validateForm);
        });
        break;
      case 'scopes':
        extractMultiSelectedOptions(eventTarget, allScopes, (selectedScopes) => {
          this.setState({scopes: selectedScopes}, this.validateForm);
        });
        break;
    }
  }

  validateForm() {
    const {clientId, secret, accessTokenValidity, refreshTokenValidity, redirectUri, grantTypes, authorities, scopes, errors} = this.state;

    return isEmpty(errors) && !!clientId && !!secret && !!accessTokenValidity && !!refreshTokenValidity && !!redirectUri && !isEmpty(grantTypes) && !isEmpty(authorities) && !isEmpty(scopes);
  }

  onSubmit(event: SyntheticInputEvent<HTMLInputElement>) {
    event.preventDefault();

    console.log(this.state);
  }

  render() {
    const {allGrantTypes, allAuthorities, allScopes, isValid, isLoading, errors} = this.state;
    const {texts} = this.props;

    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>{this.state.id ? texts.update_title : texts.create_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.onSubmit} horizontal>
            <CollapsableAlert style='danger'
                              title={this.state.id ? texts.errors.update_title : texts.errors.create_title}
                              message={texts.errors.error_text} collapse={!!errors.form}/>

            <FormGroup controlId='clientId' validationState={!!errors.clientId ? 'error' : null}>
              <HelpBlock>{errors.clientId}</HelpBlock>
              <Col componentClass={ControlLabel} sm={4}>
                {texts.client_id}
              </Col>
              <Col sm={6}>
                <FormControl name='clientId' type='text' value={this.state.clientId}
                             onChange={this.onChange} required/>
                <FormControl.Feedback/>
              </Col>
            </FormGroup>

            <FormGroup controlId='secret' validationState={!!errors.secret ? 'error' : null}>
              <HelpBlock>{errors.secret}</HelpBlock>
              <Col componentClass={ControlLabel} sm={4}>
                {texts.secret}
              </Col>
              <Col sm={6}>
                <FormControl name='secret' type='password' value={this.state.secret}
                             onChange={this.onChange} required/>
                <FormControl.Feedback/>
              </Col>
            </FormGroup>

            <FormGroup controlId='accessTokenValidity' validationState={!!errors.accessTokenValidity ? 'error' : null}>
              <HelpBlock>{errors.accessTokenValidity}</HelpBlock>
              <Col componentClass={ControlLabel} sm={4}>
                {texts.access_token_validity}
              </Col>
              <Col sm={6}>
                <FormControl name='accessTokenValidity' type='number' value={this.state.accessTokenValidity}
                             onChange={this.onChange} required/>
                <FormControl.Feedback/>
              </Col>
            </FormGroup>

            <FormGroup controlId='refreshTokenValidity'
                       validationState={!!errors.refreshTokenValidity ? 'error' : null}>
              <HelpBlock>{errors.refreshTokenValidity}</HelpBlock>
              <Col componentClass={ControlLabel} sm={4}>
                {texts.refresh_token_validity}
              </Col>
              <Col sm={6}>
                <FormControl name='refreshTokenValidity' type='number' value={this.state.refreshTokenValidity}
                             onChange={this.onChange} required/>
                <FormControl.Feedback/>
              </Col>
            </FormGroup>

            <FormGroup controlId='redirectUri' validationState={!!errors.redirectUri ? 'error' : null}>
              <HelpBlock>{errors.redirectUri}</HelpBlock>
              <Col componentClass={ControlLabel} sm={4}>
                {texts.redirect_uri}
              </Col>
              <Col sm={6}>
                <FormControl name='redirectUri' type='text' value={this.state.redirectUri}
                             onChange={this.onChange} required/>
                <FormControl.Feedback/>
              </Col>
            </FormGroup>

            <FormGroup controlId='grantTypes' validationState={!!errors.grantTypes ? 'error' : null}>
              <HelpBlock>{errors.grantTypes}</HelpBlock>
              <Col componentClass={ControlLabel} sm={4}>
                {texts.grant_types}
              </Col>
              <Col sm={6}>
                <FormControl name='grantTypes' onChange={this.onChange} componentClass='select' multiple required>
                  {allGrantTypes.map((grantType) => {
                    return (
                      <option key={grantType.id} value={grantType.id}>{grantType.name}</option>
                    );
                  })}
                </FormControl>
                <FormControl.Feedback/>
              </Col>
            </FormGroup>

            <FormGroup controlId='authorities' validationState={!!errors.authorities ? 'error' : null}>
              <HelpBlock>{errors.authorities}</HelpBlock>
              <Col componentClass={ControlLabel} sm={4}>
                {texts.authorities}
              </Col>
              <Col sm={6}>
                <FormControl name='authorities' onChange={this.onChange} componentClass='select' multiple required>
                  {allAuthorities.map((authority) => {
                    return (
                      <option key={authority.id} value={authority.id}>{authority.name}</option>
                    );
                  })}
                </FormControl>
                <FormControl.Feedback/>
              </Col>
            </FormGroup>

            <FormGroup controlId='scopes' validationState={!!errors.scopes ? 'error' : null}>
              <HelpBlock>{errors.scopes}</HelpBlock>
              <Col componentClass={ControlLabel} sm={4}>
                {texts.scopes}
              </Col>
              <Col sm={6}>
                <FormControl name='scopes' onChange={this.onChange} componentClass='select' multiple required>
                  {allScopes.map((scope) => {
                    return (
                      <option key={scope.id} value={scope.id}>{scope.name}</option>
                    );
                  })}
                </FormControl>
                <FormControl.Feedback/>
              </Col>
            </FormGroup>

            <FormGroup className='link-group'>
              <Col smOffset={7} sm={3}>
                <Button type='submit' bsStyle='primary' className='pull-right' disabled={!isValid || isLoading}
                        onClick={isValid && !isLoading ? this.onSubmit : null}>
                  {this.state.id && !isLoading ? texts.update_button_text :
                    !this.state.id && !isLoading ? texts.create_button_text : texts.button_loading_text}
                </Button>
              </Col>
            </FormGroup>
            {/*</Modal.Footer>*/}
          </Form>
        </Modal.Body>
      </Modal.Dialog>
    );
  }
}

EditClientModal.propTypes = {
  loadGrantTypes: PropTypes.func.isRequired,
  loadAuthorities: PropTypes.func.isRequired,
  loadScopes: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  saveClient: PropTypes.func.isRequired,
  texts: PropTypes.object.isRequired
}

export default EditClientModal;