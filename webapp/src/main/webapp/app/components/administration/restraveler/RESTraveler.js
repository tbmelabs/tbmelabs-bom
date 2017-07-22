'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import CollapsableAlert from '../../common/alert/CollapsableAlert';
import SortingTable from './SortingTable';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

import isEmpty from 'validate.io-empty';

require('bootstrap/dist/css/bootstrap.css');

class RESTraveler extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUrl: '/rest/api',
      data: [],
      links: [],
      limit: 0,
      history: [],
      errors: {}
    }

    this.onBack = this.onBack.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.travel = this.travel.bind(this);
  }

  componentWillMount() {
    this.travel(this.state.currentUrl, false);
  }

  onBack(event) {
    const history = this.state.history;
    history.pop();
    const lastLocation = history[history.length - 1];

    this.setState({history: history});
    this.travel(lastLocation, true);
  }

  onSelect(event) {
    this.travel(event.target.value, false);
  }

  onChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  travel(location, isStepBack) {
    const history = this.state.history;

    this.props.travelTo(location).then(
      response => {
        var links = [];
        if (response.data._links !== undefined) {
          const rawLinks = response.data._links;
          links = Object.keys(rawLinks).map((key) => {
            return {[key]: rawLinks[key].href};
          });
        }

        var data = [];
        if (response.data._embedded !== undefined) {
          const rawData = response.data._embedded;
          data = rawData[Object.keys(rawData)[0]];
        }

        if (!isStepBack) {
          history.push(location);
        }

        this.setState({currentUrl: location, data: data, filter: 'id', history: history, links: links, errors: {}});
      },
      error => this.setState({errors: {request: error.response.data.message}})
    );
  }

  render() {
    const data = this.state.data;

    return (
      <Grid>
        <Row>
          <CollapsableAlert collapse={!!this.state.errors.form} style='danger' title='An error occured: '
                            message={this.state.errors.form}/>
        </Row>

        {this.state.errors.form ? <hr/> : null}

        <Row>
          <Col sm={5}>
            <Button disabled={this.state.history.length === 1} onClick={this.onBack}>Back</Button>
          </Col>
          <Col sm={2}>
            <FormControl componentClass='select' placeholder='default' onChange={this.onSelect}>
              <option key='default' value='default'>Travel to..</option>
              {
                this.state.links.map(link => {
                  return Object.keys(link).map(key => {
                    const name = key.charAt(0).toUpperCase() + key.slice(1);
                    const value = link[key];

                    return (
                      <option key={key} value={value}>{name}</option>
                    );
                  });
                })
              }
            </FormControl>
          </Col>
          <Col sm={1}/>
          <Col sm={1}>
            <ControlLabel style={{marginTop: '10%'}}>Limit:</ControlLabel>
          </Col>
          <Col sm={1}>
            <FormControl componentClass='input' name='limit' type='text' value={this.state.limit}
                         onChange={this.onChange}/>
          </Col>
        </Row>

        <hr/>

        <Row>
          <Col>
            <CollapsableAlert collapse={isEmpty(data)} style='warning' title='No data found: '
                              message='Travel to any location first.'/>
          </Col>
        </Row>
        <Row>
          {
            isEmpty(data) ? null :
              <SortingTable data={data}/>
          }
        </Row>
      </Grid>
    );
  }
}

RESTraveler.propTypes = {
  travelTo: PropTypes.func.isRequired
}

RESTraveler.contextTypes = {
  router: PropTypes.object.isRequired
}

export default RESTraveler;