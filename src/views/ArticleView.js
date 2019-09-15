import React, { Component } from "react";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";

import Article from "../components/Article";

import { contract } from "../utils/ethereum";

export default class ArticleView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      content: null,
      error: null
    };
  }
  componentDidMount() {
    this.refetch();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.match.params.hash !== this.props.match.params.hash) {
      this.refetch();
    }
  }
  async refetch() {
    const articleHash = this.props.match.params.hash;
    this.setState({ isValid: false, error: null });
    try {
      const isValid = await contract.functions.isHashValid(articleHash);
      this.setState({
        isValid,
        error: null
      });
    } catch (err) {
      this.setState({ error: err });
    }
  }
  render() {
    return (
      <Card>
        <Card.Body>
          {this.renderHeader()}
          {this.renderContent()}
          <Link to="/">Back home</Link>
        </Card.Body>
      </Card>
    );
  }
  renderHeader() {
    const articleHash = this.props.match.params.hash;
    return (
      <div style={{ opacity: 0.5, fontSize: 10 }}>Article {articleHash}</div>
    );
  }
  renderContent() {
    const articleHash = this.props.match.params.hash;
    const isValid = this.state.isValid;
    const error = this.state.error;

    if (error) {
      if (error.message.indexOf("invalid input") !== -1) {
        return <div>Error: invalid article hash.</div>;
      } else {
        return <div>Error: given article does not exist.</div>;
      }
    }
    return <div>{isValid && <Article hash={articleHash} />}</div>;
  }
}
