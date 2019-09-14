import React, { Component } from "react";
import { Link } from "react-router-dom";

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
    this.setState({ isValid: false, content: null, error: null });
    try {
      const isValid = await contract.functions.isHashValid(articleHash);
      this.setState({
        isValid,
        content: isValid ? "valid" : "invalid",
        error: null
      });
    } catch (err) {
      this.setState({ error: err });
    }

    /*await 
    try {
      const content = await fetch(
        "https://cors-anywhere.herokuapp.com/https://google.pl"
      ).then(res => res.text());
      this.setState({ content, error: null });
    } catch (err) {
      this.setState({ error: err });
    }*/
  }
  render() {
    const content = this.state.content;
    const error = this.state.error;
    if (!content && !error) {
      return <div>Loading...</div>;
    }

    if (error) {
      if (error.message.indexOf("invalid input") !== -1) {
        return <div>Invalid article hash</div>;
      } else {
        return <div>Given article does not exist</div>;
      }
    }
    const articleHash = this.props.match.params.hash;
    return (
      <div>
        {this.state.content}
        {this.state.isValid && <Article hash={articleHash} />}
        <Link to="/">Back home</Link>
      </div>
    );
  }
}
