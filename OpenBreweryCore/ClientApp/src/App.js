import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { BrewerySearch } from './components/BrewerySearch';
import { BreweryMapDetails } from './components/BreweryMapDetails';

export default class App extends Component {
  displayName = App.name

  render() {
    return (
      <Layout>
        <Route exact path='/' component={BrewerySearch} />
        <Route path='/Details' component={BreweryMapDetails} />
      </Layout>
    );
  }
}
