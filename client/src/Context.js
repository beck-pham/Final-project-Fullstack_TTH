import React, { Component } from "react";
import Cookies from "js-cookie";
import Data from "./Data";

/**
 * In React, Context is primarily used when some data needs to be accessible by many components at different nesting levels.
 * Context lets you pass data through the component tree without having to pass props down manually at every level.
 * When using the Context API, the Provider is what provides the data that needs to be consumed by other components of the application.
 */
const Context = React.createContext();

/**
 * The Provider class in the file Context.js is a "higher-order component" that returns a Provider component
 * which provides the application state and any actions or event handlers that need to be shared between components, via a required value prop.
 */
export class Provider extends Component {
  state = {
    authenticatedUser: Cookies.getJSON("authenticatedUser") || null
  };

  constructor() {
    super();
    this.data = new Data();
  }

  render() {
    const { authenticatedUser } = this.state;
    // object containing the context to be shared throughout the App
    const value = {
      authenticatedUser,
      data: this.data,
      actions: {
        // add the 'action' property and object
        signIn: this.signIn,
        signOut: this.signOut
      }
    };
    /**
     * Pass context to the Provider. In the return() statement pass <Context.Provider> a value prop and, within curly braces, pass it value: value
     * it represents an object containing the context to be shared throughout the component tree.
     */
    return (
      <Context.Provider value={value}>{this.props.children}</Context.Provider>
    );
  }

  signIn = async (username, password) => {
    const user = await this.data.getUser(username, password);
    if (user !== null) {
      this.setState(() => {
        return {
          authenticatedUser: user
        };
      });
      //Set cookie. 1st arg: set name of the cookie. 2nd arg: specifies the value to store in the cookie 'user' object. 3rd arg: cookie options 'expires' in this case.
      Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
    }
    return user;
  };

  signOut = () => {
    //This removes the name and username properties from state – the user is no longer authenticated and cannot view the private components.
    this.setState(() => {
      return {
        authenticatedUser: null
      };
    });
    Cookies.remove("authenticatedUser");
  };
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 *  In other words, withContext automatically subscribes (or connects) the component passed to it to all actions and context changes
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  };
}
