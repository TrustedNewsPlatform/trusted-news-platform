import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Header from "./components/Header";
import "./App.css";
import HomeView from "./views/HomeView";
import ArticleView from "./views/ArticleView";
import DomainView from "./views/DomainView";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Header />
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/domain/:domain" component={DomainView} />
            <Route exact path="/article/:hash" component={ArticleView} />
          </Switch>
        </Container>
      </div>
    );
  }
}
