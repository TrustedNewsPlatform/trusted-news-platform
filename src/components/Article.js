import React, { Component } from "react";

import ReactMarkdown from "react-markdown";
import { bytes32ToIpfsHash, fetchWithTimeout } from "../utils/ipfsUtils";
import { Row, Col } from "react-bootstrap";
import { contract } from "../utils/ethereum";
import { ipfsEndpoint } from "../config";
import { getReverseTruneResolution } from "../utils/reverseTrune";

export default class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      approvers: []
    };
  }
  async componentDidMount() {
    const ipfsHash = bytes32ToIpfsHash(this.props.hash);
    this.setState({
      approvalsLeft: (await contract.functions.getNewsRemainingApprovals(
        this.props.hash
      )).toNumber(),
      approvers: await contract.functions.getNewsConcerns(this.props.hash)
    });
    try {
      this.setState({
        content: await fetchWithTimeout(ipfsEndpoint + ipfsHash).then(res =>
          res.text()
        )
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
            {this.state.approvalsLeft > 0 && (
              <div style={{ color: "red" }} className="mb-2">
                This news may not be legitimate! Still awaiting approval from{" "}
                {this.state.approvalsLeft} organisation(s)
              </div>
            )}
            <ReactMarkdown source={this.state.content} className="mb-2" />
            <div className="mb-2">
              {this.state.approvers.map(approver => (
                <div key={approver}>
                  <code>
                    <div>Approvers:</div>
                    <div>
                      {approver}{" "}
                      {getReverseTruneResolution(approver)
                        ? "(probably: " +
                          getReverseTruneResolution(approver) +
                          ")"
                        : ""}
                    </div>
                  </code>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
