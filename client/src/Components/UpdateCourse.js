import React, { Component } from "react";
import Form from "./Form";

export default class UpdateCourse extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      title: "",
      description: "",
      estimatedTime: "",
      materialsNeeded: "",
      userId: null,
      errors: []
    };
  }

  async componentDidMount() {
    const { context } = this.props;
    const authUser = context.authenticatedUser;

    context.data
      .getSingleCourse(this.props.match.params.id)
      .then(course => {
        if (course) {
          if (course.user.id === authUser.id) {
            this.setState({
              id: course.id,
              title: course.title,
              description: course.description,
              estimatedTime: course.estimatedTime,
              materialsNeeded: course.materialsNeeded,
              userId: course.user.id
            });
          } else {
            this.props.history.push("/forbidden");
          }
        } else {
          this.props.history.push("/notfound");
        }
      })
      .catch(err => {
        console.log("this is the catch error: ", err);
        this.props.history.push("/error");
      });
  }

  render() {
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors
    } = this.state;
    return (
      <div className='bounds course--detail'>
        <h1>Update Course</h1>
        <Form
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText='Update Course'
          elements={() => (
            <React.Fragment>
              <div className='grid-66'>
                <div className='course--header'>
                  <h4 className='course--label'>Course</h4>
                  <div>
                    <input
                      id='title'
                      name='title'
                      type='text'
                      className='input-title course--title--input'
                      placeholder='Course title...'
                      value={title}
                      onChange={this.change}
                    />
                  </div>
                  <p>
                    By {this.props.context.authenticatedUser.firstName}{" "}
                    {this.props.context.authenticatedUser.lastName}
                  </p>
                </div>
                <div className='course--description'>
                  <div>
                    <textarea
                      id='description'
                      name='description'
                      type='text'
                      placeholder='Course description...'
                      value={description}
                      onChange={this.change}
                    />
                  </div>
                </div>
              </div>
              <div className='grid-25 grid-right'>
                <div className='course--stats'>
                  <ul className='course--stats--list'>
                    <li className='course--stats--list--item'>
                      <h4>Estimated Time</h4>
                      <div>
                        <input
                          id='estimatedTime'
                          name='estimatedTime'
                          type='text'
                          className='course--time--input'
                          placeholder='Hours'
                          value={estimatedTime || ""}
                          onChange={this.change}
                        />
                      </div>
                    </li>
                    <li className='course--stats--list--item'>
                      <h4>Materials Needed</h4>
                      <div>
                        <textarea
                          id='materialsNeeded'
                          name='materialsNeeded'
                          placeholder='List materials...'
                          value={materialsNeeded || ""}
                          onChange={this.change}
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </React.Fragment>
          )}
        />
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
    const authUser = context.authenticatedUser;

    const {
      id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId
    } = this.state;

    const course = {
      id,
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId
    };
    const emailAddress = authUser.emailAddress;
    const password = authUser.password;

    context.data
      .updateCourse(course, emailAddress, password)
      .then(errors => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          console.log(`The course: ${title} was updated`);
          this.props.history.push(`/courses/${this.props.match.params.id}`);
        }
      })
      .catch(err => {
        this.props.history.push("/error");
      });
  };

  cancel = () => {
    this.props.history.push(`/courses/${this.props.match.params.id}`);
  };
}
