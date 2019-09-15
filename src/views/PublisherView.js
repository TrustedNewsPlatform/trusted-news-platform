import React, { Component } from "react";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import ipfsClient from "ipfs-http-client";

import { contract, provider, signerAvailable } from "../utils/ethereum";
import { ipfsHashToBytes32, bytes32ToIpfsHash } from "../utils/ipfsUtils";
import { Row, Col, Card, InputGroup } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { ipfsApiHost, ipfsApiPort } from "../config";

export default class PublisherView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textarea: "",
      newApprover: "",
      approvers: []
    };
  }
  render() {
    return (
      <div>
        <div
          style={{ color: "red", display: signerAvailable ? "none" : "block" }}
        >
          For this to work you need an exposed Ethereum wallet in browser (e.g.
          using Metamask or Mist).
        </div>
        <Row>
          <Col
            style={{ paddingTop: 20, paddingBottom: 10, fontWeight: "bold" }}
          >
            Edit news
          </Col>
          <Col
            style={{ paddingTop: 20, paddingBottom: 10, fontWeight: "bold" }}
          >
            Preview
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <FormControl
                disabled={!signerAvailable}
                as="textarea"
                className="mr-sm-2"
                value={this.state.textarea}
                onChange={evt => this.setState({ textarea: evt.target.value })}
                placeholder="Enter news text here..."
                style={{ minHeight: 400 }}
              />
              <div>
                <div>
                  {this.state.approvers.map(approver => (
                    <div style={{ padding: 5 }}>
                      {approver}{" "}
                      <Button
                        onClick={() => {
                          const newApp = this.state.approvers;
                          newApp.splice(
                            this.state.approvers.indexOf(approver),
                            1
                          );
                          this.setState({ approvers: newApp });
                        }}
                      >
                        -
                      </Button>
                    </div>
                  ))}
                </div>
                <InputGroup className="mt-2">
                  <FormControl
                    disabled={!signerAvailable}
                    value={this.state.newApprover}
                    onChange={evt =>
                      this.setState({ newApprover: evt.target.value })
                    }
                    placeholder="Enter additional approver address..."
                  />
                  <Button
                    onClick={evt => {
                      if (
                        this.state.approvers
                          .map(s => s.toLowerCase())
                          .indexOf(this.state.newApprover.toLowerCase()) !== -1
                      )
                        return;
                      this.setState({
                        approvers: [
                          ...this.state.approvers,
                          this.state.newApprover
                        ].sort(),
                        newApprover: ""
                      });
                    }}
                  >
                    +
                  </Button>
                </InputGroup>
              </div>
              <Button
                disabled={!signerAvailable}
                className="mt-2"
                onClick={() => this.publish()}
              >
                Publish
              </Button>
            </Form>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <ReactMarkdown
                  source={this.state.textarea}
                  style={{ padding: 0 }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
  async publish() {
    if (!signerAvailable)
      return alert(
        "There's no signer available, please install Metamask extension or use Ethereum-enabled browser."
      );
    const ipfs = ipfsClient(ipfsApiHost, ipfsApiPort, { protocol: "https" });
    const [res] = await ipfs.add(this.state.textarea);
    console.log("IPFS hash: " + res.hash);
    const b32hash = ipfsHashToBytes32(res.hash);
    console.log("Bytes32 hash: " + b32hash);
    console.log(provider.address);
    console.log(
      await contract.functions.publishNews(b32hash, this.state.approvers)
    );
  }
}
