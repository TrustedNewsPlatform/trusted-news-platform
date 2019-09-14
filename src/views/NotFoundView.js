import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class NotFoundView extends Component {
  render() {
    return (
      <div>
        <h2>404. Not Found</h2>
        <Link to="/">Go away safely</Link>
      </div>
    );
  }
}
