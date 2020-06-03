import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

// Create context
const Context = React.createContext();

export class Provider extends Component {
    
    state = {
        authenticatedUser: Cookies.getJSON('authenticatedUser')  || null,
    }

    constructor() {
        super();
        this.data = new Data();
    }
    render() {
        const { authenticatedUser } = this.state

    // object containing the context to be shared throughout the App
    const value = {
        authenticatedUser,
        data: this.data,
        actions: { // Add actions property to the object
            signIn: this.signIn,
            signOut: this.signOut,
        },
    }

    return (
        <Context.Provider value={value} >
            {this.props.children}
        </Context.Provider>
        );
    } 


    signIn = async (emailAddress, password) => {
       const user = await this.data.getUser(emailAddress, password);
        if(user !== null) {
            user.password = password;
            this.setState(() => {
                return {
                    authenticatedUser: user
                };
            });
            // Set a cookie
            Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
        }
        return user;
    }
    
    
    
    signOut = () => {
        this.setState(() => {
            return {
                authenticatedUser: null
            };
        });
        Cookies.remove('authenticatedUser')
    }

    
 
    
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
    return function ContextComponent(props) {
      return (
        <Context.Consumer>
            {context => <Component {...props} context={context} /> }
        </Context.Consumer>
    );
  }
}