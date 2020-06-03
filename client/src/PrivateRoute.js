import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

// de-structure and rename component prop in the params. "rest" are any props passed in
export default ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      { context => (
          <Route
            {...rest}
            render={props => context.authenticatedUser ? (
            <Component {...props} />
           ) : (
            <Redirect to={{
              pathname: '/signin',
              state: { from: props.location},
            }} />
          )
          }
          />
      )}
    </Consumer>
  );
};
