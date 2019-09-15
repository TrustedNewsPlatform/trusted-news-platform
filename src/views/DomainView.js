import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Card } from "react-bootstrap";

import { contract } from "../utils/ethereum";
import ArticleCard from "../components/ArticleCard";
import { getTruneResolution } from "../utils/reverseTrune";

export default class DomainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publicKey: null,
      error: null,
      newsCount: null,
      news: []
    };
  }

  componentDidMount() {
    this.refetch();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.match.params.domain !== this.props.match.params.domain) {
      this.refetch();
    }
  }
  async refetch() {
    await this.setState({
      publicKey: null,
      error: null,
      news: [],
      newsCount: null
    });
    try {
      const publicKey = await getTruneResolution(
        this.props.match.params.domain
      );
      this.setState({ publicKey, error: null });
      const count = await contract.functions.getNewsConceringCount(publicKey);
      this.setState({ newsCount: count.toNumber() });
      for (let i = count - 1; i >= (count > 10 ? count - 11 : 0); i--) {
        this.setState({
          news: [
            ...this.state.news,
            await contract.functions.getNewsConceringByID(publicKey, i)
          ]
        });
      }
    } catch (err) {
      console.log(err);
      this.setState({ error: err });
    }
  }
  render() {
    const publicKey = this.state.publicKey;
    const error = this.state.error;
    if (!publicKey && !error) {
      return <div>Loading...</div>;
    }
    if (error) {
      return (
        <div>
          This domain owner does not seem to integrate with Trune. Ask them to
          do so!
        </div>
      );
    }
    return (
      <div>
        <h1>{this.props.match.params.domain}</h1>
        <div style={{ opacity: 0.5, fontSize: 10 }}>
          {publicKey ? "Public key: " + publicKey : "Loading publicKey..."}
        </div>
        <div className="mb-2">
          Total article count: {this.state.newsCount} (showing last 10)
        </div>
        <div>
          {this.state.news.map(hash => (
            <ArticleCard hash={hash} key={hash} />
          ))}
        </div>
        <div className="mb-2">
          <Link to="/">Go back</Link>
        </div>
      </div>
    );
  }
}
