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
        {this.state.lnnodes.map(lnnode =>
          <div key={lnnode.id}>{lnnode.text}</div>
        )}
      </div>
    );
  }
}

export default App;
