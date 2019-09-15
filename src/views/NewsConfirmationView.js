import React, { Component } from "react";

import { Card, Button } from "react-bootstrap";

import Swal from "sweetalert2";

import { contract, provider, signerAvailable } from "../utils/ethereum";
import { ethers } from "ethers";

export class NewsConfirmationView extends Component {
  state = {
    allNews: [],
    notConfirmedNews: [],
    loaded: false,
    newsCount: null
  };

  async componentDidMount() {
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
      const remainingApprovals = await contract.getNewsRemainingApprovals(
        this.state.allNews[i]
      );
      if (!isNewsConfirmed && remainingApprovals !== 0) {
        this.setState({
          notConfirmedNews: [
            ...this.state.notConfirmedNews,
            this.state.allNews[i]
          ]
        });
      }
    }
    this.setState({ loaded: true });
  }

  async handleApprove(ipfsHash) {
    await contract.approveNews(ipfsHash);
  }
  async handleDisapprove(ipfsHash, explanationHash) {
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
        window.localStorage.setItem(
          "trune" + ipfsHash + "HasBeenDisapproved",
          true
        );
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
                    {window.localStorage.getItem(
                      "trune" + hash + "HasBeenDisapproved"
                    ) ? null : (
                      <div>
                        <Card style={{ width: "18rem" }}>
                          <Card.Body>
                            <Card.Title>Some name</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              {hash}
                            </Card.Subtitle>
                          </Card.Body>
                          <Button
                            variant="success"
                            style={{ marginLeft: "5px", marginRight: "5px" }}
                            onClick={async () => {
                              await this.handleApprove(hash);
                            }}
                          >
                            Approve
                          </Button>
                          <br />
                          <Button
                            variant="danger"
                            style={{ marginLeft: "5px", marginRight: "5px" }}
                            onClick={async () => {
                              await this.handleDisapprove(hash, "");
                            }}
                          >
                            Decline
                          </Button>
                        </Card>
                        <br />
                      </div>
                    )}
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
