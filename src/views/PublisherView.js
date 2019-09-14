import React, { Component } from "react";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import ipfsClient from "ipfs-http-client";

import { contract, provider } from "../utils/ethereum";
import { ipfsHashToBytes32, bytes32ToIpfsHash } from "../utils/ipfsUtils";

export default class PublisherView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textarea: ""
    };
  }
  render() {
    return (
      <div>
        <div>
          For this to work you need a local IPFS node on port 5001, and an
          exposed Ethereum wallet in browser (e.g. using Metamask or Mist).
        </div>
        <Form>
          <FormControl
            as="textarea"
            className="mr-sm-2 mt-2"
            value={this.state.textarea}
            onChange={evt => this.setState({ textarea: evt.target.value })}
            placeholder="Enter news text here..."
          />
          <Button className="mt-2" onClick={() => this.publish()}>
            Publish
          </Button>
        </Form>
      </div>
    );
  }
  async publish() {
    const ipfs = ipfsClient("127.0.0.1", 5001, { protocol: "http" });
    const [res] = await ipfs.add(this.state.textarea);
    console.log("IPFS hash: " + res.hash);
    const b32hash = ipfsHashToBytes32(res.hash);
    console.log("Bytes32 hash: " + b32hash);
    console.log(provider.address);
    console.log(
      await contract.functions.publishNews(b32hash, [
        await provider.getAddress()
      ])
    );
  }
}
