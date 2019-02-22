import React, { Component } from 'react';
import './App.css';
import ListingForm from './ListingForm/index'

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
        <h1>List your node</h1> 

        <ListingForm/> 

        {this.state.lnnodes.map(lnnode =>
          <div key={lnnode.id}>{lnnode.text}</div>
        )}
      </div>
    );
  }
}

export default App;
