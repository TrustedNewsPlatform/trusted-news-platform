import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import TruneLogo from "../resources/logo.png";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBar: ""
    };
  }
  render() {
    return (
      <Navbar expand="sm">
        <Navbar.Brand>
          <Link to="/">
            <img
              src={TruneLogo}
              height="22"
              style={{ marginTop: 10, marginBottom: 10 }}
              className="d-inline-block align-top"
              alt="Trune logo"
            />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Form
            inline
            onSubmit={evt => {
              evt.preventDefault();
              this.props.history.push("/domain/" + this.state.searchBar);
            }}
          >
            <FormControl
              type="text"
              placeholder="Enter news domain..."
              className="mr-sm-2"
              value={this.state.searchBar}
              onChange={evt => this.setState({ searchBar: evt.target.value })}
            />
            <Button
              as={Link}
              to={"/domain/" + this.state.searchBar}
              variant="outline-primary"
            >
              Show
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
export default withRouter(Header);
