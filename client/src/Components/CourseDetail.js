import React, { Component } from "react";
import { Link } from "react-router-dom";

const ReactMarkdown = require("react-markdown");

export default class CourseDetail extends Component {
  constructor() {
    super();
    this.state = {
      course: {},
      errors: []
    };
  }

  async componentDidMount() {
    try {
      const { context } = this.props;
      const course = await context.data.getSingleCourse(
        this.props.match.params.id
      );
      if (course !== null) {
        this.setState(() => {
          return {
            course
          };
        });
      } else if (!course.id) {
        this.props.history.push("/notfound");
      }
    } catch (error) {
      this.props.history.push("/notfound");
    }
  }

  render() {
    const { course } = this.state;
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const courseUserId = ((course || {}).user || {}).id;
    const firstName = ((course || {}).user || {}).firstName;
    const lastName = ((course || {}).user || {}).lastName;
    return (
      <div>
        <div className='actions--bar'>
          <div className='bounds'>
            <div className='grid-100'>
              {authUser && authUser.id === courseUserId && (
                <React.Fragment>
                  <Link className='button' to={`/courses/${course.id}/update`}>
                    Update Course
                  </Link>
                  <Link className='button' onClick={this.deleteCourse} to='/'>
                    Delete Course
                  </Link>
                </React.Fragment>
              )}
              <Link className='button button-secondary' to='/'>
                Return to list
              </Link>
            </div>
          </div>
        </div>
        <div className='bounds course--detail'>
          <div className='grid-66'>
            <div className='course--header'>
              <h4 className='course--label'>Course</h4>
              <h3 className='course--title'>{course.title}</h3>
              <p>
                By {firstName} {lastName}{" "}
              </p>
            </div>
            <div className='course--description'>
              <ReactMarkdown source={course.description} />
            </div>
          </div>
          <div className='grid-25 grid-right'>
            <div className='course--stats'>
              <ul className='course--stats--list'>
                <li className='course--stats--list--item'>
                  <h4>Estimated Time</h4>
                  <h3>{course.estimatedTime}</h3>
                </li>
                <li className='course--stats--list--item'>
                  <h4>Materials Needed</h4>
                  <ReactMarkdown source={course.materialsNeeded} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  deleteCourse = e => {
    e.preventDefault();

    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const emailAddress = authUser.emailAddress;
    const password = authUser.password;
    const userId = authUser.id;

    const { course } = this.state;

    if (course.user.id === userId) {
      context.data
        .deleteCourse(course, emailAddress, password)
        .then(errors => {
          if (errors.length) {
            this.state({ errors });
          } else {
            this.props.history.push("/");
          }
        })
        .catch(err => {
          console.log("this is the delete course catch error: ", err);
          this.props.history.push("/error");
        });
    } else {
      this.props.history.push("/forbidden");
    }
  };
}
