import React from "react";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions/";

import { FcGoogle } from "react-icons/fc";

import history from "../history";

import "../styles/GoogleAuth.scss";

//to create this go to console.developers.google.com to set up a new project.
//Stephen has a good video on how to do this
//must add the following script tag to index.html for this to work!!!!!
//<script src="https://apis.google.com/js/api.js"></script>

class GoogleAuth extends React.Component {
  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      //arrow function gets callback once all data has been retrieved from google api

      window.gapi.client
        .init({
          clientId:
            "179852744675-mbipju82gjs6d3vnc7bf60gbsavnhpbp.apps.googleusercontent.com",
          scope: "email",
        })
        .then(() => {
          // console.log("Google Auth func called - function called");
          //this .then will be automatically evoked once our library has successfully initialized itself
          this.auth = window.gapi.auth2.getAuthInstance(); //this will allow us to refer to this.auth anywhere within this class component, which can be used to sign them in or out or get their authentication status
          this.updateSignInStatus(this.auth.isSignedIn.get()); //returns either true or false and passed that to updateSigninStatus function
          this.auth.isSignedIn.listen(this.updateSignInStatus); //this will check to see if signed in status changes and update state & refresh content accordingly
        });
    });
  }

  updateSignInStatus = (isSignedIn) => {
    //received either true or false as argument when called
    if (isSignedIn) {
      this.props.signIn(this.auth.currentUser.get().getId()); //gets the usersId
    } else {
      this.props.signOut();
    }
  };

  onSignInClick = () => {
    this.auth.signIn();
  };

  componentDidUpdate = () => {
    //the below sends the users to their lists page the moment they login from the landing page

    if (this.props.isSignedIn) {
      history.push("/main");
    }
  };

  onSignOutClick = () => {
    this.auth.signOut();
    history.push("/");
  };

  renderAuthButton() {
    // if (this.props.isSignedIn === null) {
    //   return null;
    // } else
    if (this.props.isSignedIn) {
      return (
        <button className="google__admin-btn" onClick={this.onSignOutClick}>
          <i className="google__icon">
            <FcGoogle />
          </i>
          Sign Out
        </button>
      );
    } else {
      return (
        <button className="google__admin-btn" onClick={this.onSignInClick}>
          <i className="google__icon">
            <FcGoogle />
          </i>
          Sign In
        </button>
      );
    }
  }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
