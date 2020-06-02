import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "./Form";

export default class UserSignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    errors: []
  };

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword,
      errors
    } = this.state;

    return (
      <div className='bounds'>
        <div className='grid-33 centered signin'>
          <h1>Sign Up</h1>
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText='Sign Up'
            elements={() => (
              <React.Fragment>
                <input
                  id='firstName'
                  name='firstName'
                  type='text'
                  value={firstName}
                  onChange={this.change}
                  placeholder='First Name'
                />
                <input
                  id='lastName'
                  name='lastName'
                  type='text'
                  value={lastName}
                  onChange={this.change}
                  placeholder='last Name'
                />
                <input
                  id='emailAddress'
                  name='emailAddress'
                  type='email'
                  value={emailAddress}
                  onChange={this.change}
                  placeholder='email@email.com'
                />
                <input
                  id='password'
                  name='password'
                  type='password'
                  value={password}
                  onChange={this.change}
                  placeholder='Password'
                />
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  value={confirmPassword}
                  onChange={this.change}
                  placeholder='Confirm Password'
                />
              </React.Fragment>
            )}
          />
          <p>
            Already have a user account? <Link to='/signin'>Click here</Link> to
            sign in!
          </p>
        </div>
      </div>
    );
  }

  change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(() => {
      return {
        [name]: value
      };
    });
  };

  submit = () => {
    const { context } = this.props;

    const {
      firstName,
      lastName,
      emailAddress,
      password,
      confirmPassword
    } = this.state;
    const user = {
      firstName,
      lastName,
      emailAddress,
      password
    };
    if (password !== confirmPassword) {
      this.setState({
        errors: ["Your passwords do not match. Please try again."]
      });
    } else {
      context.data
        .createUser(user)
        .then(errors => {
          if (errors.length) {
            this.setState({ errors });
          } else {
            console.log(`${emailAddress} is successfully signed up!`);
            context.actions.signIn(emailAddress, password).then(() => {
              this.props.history.push("/");
            });
          }
        })
        .catch(err => {
          // handle rejected promises
          console.log(err);
          this.props.history.push("./error"); // Push to history stack
        });
    }
  };
  cancel = () => {
    this.props.history.push("/");
  };
}
