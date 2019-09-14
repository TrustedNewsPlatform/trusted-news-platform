import React, { Component } from "react";

import { Card, Button } from "react-bootstrap";

import { contract, provider } from "../utils/ethereum";

export class NewsConfirmationView extends Component {
  state = {
    allNews: [],
    notConfirmedNews: [],
    loaded: false,
    newsCount: null
  };

  async componentDidMount() {
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
      if (!isNewsConfirmed) {
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
    await contract.disapproveNews(ipfsHash, explanationHash);
  }

  render() {
    return (
      <div>
        {" "}
        {this.state.loaded ? (
          <div>
            {this.state.notConfirmedNews.map(hash => (
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
            ))}
          </div>
        ) : (
          "loading ..."
        )}
      </div>
    );
  }
}
