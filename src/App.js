import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import "./App.css";

import TruneLogo from "./resources/logo.png";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Navbar expand="sm">
            <Navbar.Brand href="#home">
              <img
                src={TruneLogo}
                height="22"
                style={{ marginTop: 4, marginBottom: 4 }}
                className="d-inline-block align-top"
                alt="Trune logo"
              />
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Form inline>
                <FormControl
                  type="text"
                  placeholder="Enter news domain..."
                  className="mr-sm-2"
                />
                <Button variant="outline-primary">Show</Button>
              </Form>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </div>
    );
  }
}
