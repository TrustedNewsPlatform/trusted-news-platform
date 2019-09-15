import React, { Component } from "react";

import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { bytes32ToIpfsHash, fetchWithTimeout } from "../utils/ipfsUtils";

import ReactMarkdown from "react-markdown";

import { contract } from "../utils/ethereum";
import { ipfsEndpoint } from "../config";

export default class ArticleCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      error: false,
      approvalsLeft: 0
    };
  }
  async componentDidMount() {
    const ipfsHash = bytes32ToIpfsHash(this.props.hash);
    this.setState({
      approvalsLeft: await contract.functions.getNewsRemainingApprovals(
        this.props.hash
      )
    });
    try {
      this.setState({
        content: await fetchWithTimeout(ipfsEndpoint + ipfsHash).then(res =>
          res.text()
        )
      });
    } catch (err) {
      this.setState({
        content: "Error: news does not exist or is unavailable at the moment",
        error: true
      });
    }
  }
  render() {
    return (
      <Card className="mb-2">
        <Card.Body>
          <div style={{ opacity: 0.5, fontSize: 10 }}>
            Article {this.props.hash}
          </div>
          {this.state.approvalsLeft > 0 && (
            <div style={{ color: "red" }}>This news may not be legitimate!</div>
          )}
          {!this.state.content ? (
            <div>Loading preview...</div>
          ) : (
            <div style={{ fontFamily: "Georgia" }}>
              <ReactMarkdown
                source={
                  this.state.content.substr(0, 100) +
                  (this.state.error ? "" : "...")
                }
              />
              <Link to={"/article/" + this.props.hash}>
                {this.state.error ? "Check it out anyway..." : "Read more..."}
              </Link>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  }
}
