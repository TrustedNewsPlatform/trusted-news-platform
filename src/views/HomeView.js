import React, { Component } from "react";

import { Link } from "react-router-dom";

export default class HomeView extends Component {
  render() {
    return (
      <div>
        HomeView
        <Link to="/article/1234">Article 1234</Link>
        <Link to="/domain/piotradamczyk.pl">Domain piotradamczyk.pl</Link>
      </div>
    );
  }
}
