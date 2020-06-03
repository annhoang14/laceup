import React, { Component } from 'react';
import LogInRoute from "./LandingPage/LogInRoute.js";
import Login from "./LandingPage/Login.js";
import SignUp from "./LandingPage/SignUp.js";
import Faq from "./FAQ/Faq.js";
import About from "./About/About.js";
import Account from "./Account/Account.js";
import NavBar from "./navComps/navBar.js";
import HowItWorks from "./LandingPage/HowItWorks.js";
import { base } from './config/Firebase';

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: {},
      isLoggedIn: false,
      firebaseInitialized: false,
    }
  }

  //https://coderjourney.com/tutorials/how-to-integrate-react-with-firebase/
  addUser = (user) => {
    const users = { ...this.state.users };
    users[user.referralCode] = {
      username: user.username,
      email: user.email,
      referralCode: user.referralCode,
      score: 0,
    };
    this.setState({ users });
  }

  componentWillMount() {
    this.usersRef = base.syncState('users', {
      context: this,
      state: "users"
    })
  }

  componentDidMount() {
    let isInitialized = new Promise(resolve => {
      base.initializedApp.auth().onAuthStateChanged(resolve)
    })
    this.setState({ firebaseInitialized: isInitialized })
  }

  componentWillUnmount() {
    base.removeBinding(this.usersRef)
  }

  toggleLoginState = (isLoggedIn) => {
    this.setState({ isLoggedIn: isLoggedIn })
  }

  //https://learnwithparam.com/blog/dynamic-pages-in-react-router/
  render() {
    return (
      <div>
        <NavBar />
        <Router>
          <div className="App">
            <Switch>
              <Route path="/faq" component={Faq} />
              <Route path="/about" component={About} />
              <Route path="/account/:username/:userId" component={Account} /> {/* unique to user */}
              <Route path="/login"
                render={(props) =>
                  // (<LogInRoute
                  //   isLoggedIn={this.state.isLoggedIn} {...props}
                  //   user={this.state.user}{...props}
                  // />)
                  (<Login
                    isLoggedIn={this.state.isLoggedIn} {...props}

                  />)
                }
              />
              <Route path="/register"
                render={(props) =>
                  <SignUp
                    toggleLoginState={this.toggleLoginState} {...props}
                    addUser={this.addUser}
                  />
                }
              />
              <Route path="/" component={HowItWorks} /> {/* landing page before log in*/}

            </Switch>
          </div>
        </Router >
      </div>
    )
  }
}
