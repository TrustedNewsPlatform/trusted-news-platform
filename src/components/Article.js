import React, { Component } from "react";

import ReactMarkdown from "react-markdown";
import { bytes32ToIpfsHash, fetchWithTimeout } from "../utils/ipfsUtils";
import { Row, Col } from "react-bootstrap";
import { ipfsEndpoint } from "../config";

export default class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null
    };
  }
  async componentDidMount() {
    try {
      this.setState({
        content: await fetchWithTimeout(
          ipfsEndpoint + bytes32ToIpfsHash(this.props.hash)
        ).then(res => res.text())
      });
    } catch (err) {
      this.setState({
        content: "Error: news does not exist or is unavailable at the moment"
      });
    }
  }
  render() {
    if (!this.state.content) {
      return <div>Loading article...</div>;
    }
    return (
      <div style={{ fontFamily: "Georgia" }}>
        <Row>
          <Col>
            <ReactMarkdown source={this.state.content} />
          </Col>
        </Row>
      </div>
    );
  }
}
