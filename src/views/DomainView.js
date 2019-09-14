import React, { Component } from "react";
import { Link } from "react-router-dom";

import { contract } from "../utils/ethereum";

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
      const publicKey = await fetch(
        "https://" + this.props.match.params.domain + "/trune.txt"
      ).then(res => res.text());
      this.setState({ publicKey, error: null });
      const count = await contract.functions.getNewsConceringCount(publicKey);
      this.setState({ newsCount: count.toNumber() });
      for (let i = 0; i < count; i++) {
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
        <div>Hooray! This domain owner integrates with Trune.</div>
        <div>{publicKey ? publicKey : "Loading publicKey..."}</div>
        <div>News count: {this.state.newsCount}</div>
        <div>
          {this.state.news.map(hash => (
            <div key={hash}>
              <Link to={"/article/" + hash}>{hash}</Link>
            </div>
          ))}
        </div>
        <div>
          <Link to="/">Back home</Link>
        </div>
      </div>
    );
  }
}
