import React, { Component } from "react";

import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

export default class HomeView extends Component {
  render() {
    return (
      <div style={{ fontFamily: "Georgia" }}>
        <Card>
          <Card.Body>
            <h2>What is Trune?</h2>
            <p>
              <b>Trune</b> is a <b>Tru</b>sted <b>ne</b>ws platform for the
              modern world. A world in which every news can be fake, and there
              is no easy way to distinguish it.
            </p>
            <h3>That's where we come</h3>
            <p>
              Trune completely <i>ELIMINATES</i> (this shout sounds cool right?)
              fake news by aggregating them by concerned parties and forcing
              these parties to react on the news before it is published on the
              site.
            </p>
            <h3>Check out these sites which already use our solution</h3>
            <ul>
              {["piotradamczyk.pl", "quanosky.pl", "xeno.yt"]
                .sort()
                .map(domain => (
                  <li key={domain}>
                    <Link to={"/domain/" + domain}>{domain}</Link>
                  </li>
                ))}
            </ul>
            <h3>Or just integrate your own one</h3>
            <p>
              First, you need to install and configure Metamask browser
              extension - it is available for all major browsers and its
              installation is pretty straight forward. In real environment you
              would want to use a hardware security module like YubiKey or a
              hardware wallet, but its a hackathon and writing such a
              complicated full-fledged production guide is not in our scope this
              time. So - then you can copy the address shown in Metamask to a
              file named <code>trune.txt</code> and put it in the root directory
              of your web server. It's that simple!
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
