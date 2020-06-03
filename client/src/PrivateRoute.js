import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Consumer } from "./Context";

export default ({ component: Component, ...rest }) => {
  // Destructures and renames the component prop in its parameters; collects any props that get passed to it in a ...rest variable:
  return (
    // <Consumer> component connects PrivateRoute to all the actions and data provided by Context.js
    <Consumer>
      {context => (
        <Route
          {...rest}
          /*
           * Anything rendered within <Consumer> is connected to context changes, which means that <Route> has access to the authenticatedUser state (via context.authenticatedUser)
           * The value of context.authenticatedUser is either an object holding the authenticated user's name and username, or null.
           */
          render={props =>
            context.authenticatedUser ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  // The state property holds information about the user's current location. If authentication is successful, the router can redirect the user back to the original location (from: props.location).
                  pathname: "/signin",
                  state: { from: props.location }
                }}
              />
            )
          }
        />
      )}
    </Consumer>
  );
};
