import React, { Component } from 'react';
import './App.css';
import ListingForm from './ListingForm/index'
import 'typeface-roboto';

class App extends Component {
  state = {lnnodes: []}

  componentDidMount() {
    fetch('/lnnode')
      .then(res => res.json())
      .then(lnnodes => this.setState({ lnnodes }));
  }

  render() {
    return (
      <div className="App">

        <ListingForm/> 
From DB: 
        <ul>
          {this.state.lnnodes.map(lnnode =>
              <li key={lnnode.id}>Node {lnnode.id}: {lnnode.nodeID}</li>
          )}
        </ul>

        <center>Support email info@1sat1.com</center>
      </div>
    );
  }
}

export default App;
