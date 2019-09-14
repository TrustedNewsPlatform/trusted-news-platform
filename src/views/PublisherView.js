import React, { Component } from "react";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

export default class PublisherView extends Component {
  render() {
    return (
      <div>
        <Form>
          <FormControl as="textarea" className="mr-sm-2" />
        </Form>
      </div>
    );
  }
}
