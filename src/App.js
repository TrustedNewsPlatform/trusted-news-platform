import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Header from "./components/Header";
import "./App.css";
import HomeView from "./views/HomeView";
import ArticleView from "./views/ArticleView";
import DomainView from "./views/DomainView";
import { NewsConfirmationView } from "./views/NewsConfirmationView";
import PublisherView from "./views/PublisherView";
import NotFoundView from "./views/NotFoundView";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Header />
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route path="/article/:hash" component={ArticleView} />
            <Route path="/publish" component={PublisherView} />
            <Route path="/confirm" component={NewsConfirmationView} />
            <Route path="/domain/:domain" component={DomainView} />
            <Route component={NotFoundView} />
          </Switch>
        </Container>
      </div>
    );
  }
}
