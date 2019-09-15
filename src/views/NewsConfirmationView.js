import React, { Component } from "react";

import { Card, Button, ButtonToolbar } from "react-bootstrap";

import Swal from "sweetalert2";

import { contract, provider, signerAvailable } from "../utils/ethereum";
import { ethers } from "ethers";

import { ipfsEndpoint } from "../config";
import { bytes32ToIpfsHash, fetchWithTimeout } from "../utils/ipfsUtils";

import ReactMarkdown from "react-markdown";

import { Link } from "react-router-dom";

export class NewsConfirmationView extends Component {
  state = {
    allNews: [],
    notConfirmedNews: [],
    loaded: false,
    newsCount: null,
    contents: {}
  };

  async getContractData() {
    if (!signerAvailable) return this.setState({ loaded: true });
    const address = await provider.getAddress();
    const newsCount = await contract.getNewsConceringCount(address);

    for (let i = 0; i < newsCount.toNumber(); i++) {
      const news = await contract.getNewsConceringByID(address, i);
      this.setState({ allNews: [...this.state.allNews, news] });
    }

    for (let i = 0; i < this.state.allNews.length; i++) {
      const isNewsConfirmed = await contract.isNewsApprovedBy(
        this.state.allNews[i],
        address
      );
      const didVoteFor = await contract.didVote(this.state.allNews[i], address);
      if (!isNewsConfirmed && !didVoteFor) {
        this.setState({
          notConfirmedNews: [
            ...this.state.notConfirmedNews,
            this.state.allNews[i]
          ]
        });
        const ipfsHash = await bytes32ToIpfsHash(this.state.allNews[i]);
        const content = await fetchWithTimeout(ipfsEndpoint + ipfsHash).then(
          res => res.text()
        );
        let stateContents = this.state.contents;
        stateContents[this.state.allNews[i]] = content;
        this.setState({ contents: stateContents });
      }
    }
    this.setState({ loaded: true });
  }

  async componentDidMount() {
    await this.getContractData();
  }

  async handleApprove(ipfsHash) {
    await contract.approveNews(ipfsHash);
  }
  async handleDisapprove(ipfsHash) {
    Swal.fire({
      title: "Please give a reason",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: async explanation => {
        await contract.disapproveNews(
          ipfsHash,
          ethers.utils.sha256(Buffer(explanation))
        );
      }
    });
  }

  render() {
    return (
      <div>
        <div
          style={{ color: "red", display: signerAvailable ? "none" : "block" }}
          className="mb-4"
        >
          For this to work you need an exposed Ethereum wallet in browser (e.g.
          using Metamask or Mist).
        </div>
        {this.state.loaded ? (
          <div>
            {this.state.notConfirmedNews.length === 0 ? (
              "Nothing to be confirmed"
            ) : (
              <div>
                {this.state.notConfirmedNews.map(hash => (
                  <div>
                    <div>
                      <Card
                        style={{
                          width: "100%",
                          marginLeft: "10px",
                          marginRight: "10px"
                        }}
                      >
                        <Card.Body>
                          <Card.Title>
                            <ReactMarkdown
                              source={
                                this.state.contents[hash]
                                  .replace(/!\[(.*)\]\(.*\)/g, "`$1`")
                                  .split("\n")[0]
                              }
                            />
                          </Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            <Link to={"/article/" + hash}>
                              {"Read more..."}
                            </Link>
                          </Card.Subtitle>
                        </Card.Body>
                        <ButtonToolbar style={{ padding: 10 }}>
                          <Button
                            variant="danger"
                            style={{ marginLeft: "5px", marginRight: "5px" }}
                            onClick={async () => {
                              await this.handleDisapprove(hash);
                            }}
                          >
                            Decline
                          </Button>
                          <Button
                            variant="success"
                            style={{ marginLeft: "5px", marginRight: "5px" }}
                            onClick={async () => {
                              await this.handleApprove(hash);
                            }}
                          >
                            Approve
                          </Button>
                        </ButtonToolbar>
                      </Card>
                      <br />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          "Loading..."
        )}
      </div>
    );
  }
}
