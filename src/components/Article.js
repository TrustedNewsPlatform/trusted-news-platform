import React, { Component } from "react";

import ReactMarkdown from "react-markdown";
import { bytes32ToIpfsHash, fetchWithTimeout } from "../utils/ipfsUtils";
import { Row, Col } from "react-bootstrap";

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
          "http://127.0.0.1:8080/ipfs/" + bytes32ToIpfsHash(this.props.hash)
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
