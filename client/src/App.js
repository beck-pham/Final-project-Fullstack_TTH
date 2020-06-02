import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import withContext from "./Context";
import PrivateRoute from "./PrivateRoute";

// Imports Components to App
import Courses from "./Components/Courses";
import CourseDetail from "./Components/CourseDetail";
import CreateCourse from "./Components/CreateCourse";
import UpdateCourse from "./Components/UpdateCourse";
import Header from "./Components/Header";
import NotFound from "./Components/NotFound";
import UserSignIn from "./Components/UserSignIn";
import UserSignOut from "./Components/UserSignOut";
import UserSignUp from "./Components/UserSignUp";
import ErrorHandler from "./Components/ErrorHandler";
import Forbidden from "./Components/Forbidden";

// Connect/Subscribe components to context
const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const HeaderWithContext = withContext(Header);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const UserSignUpWithContext = withContext(UserSignUp);

export default () => (
  <BrowserRouter>
    <div>
      <HeaderWithContext />

      <Switch>
        <Route exact path='/' component={CoursesWithContext} />
        <PrivateRoute
          path='/courses/create'
          component={CreateCourseWithContext}
        />
        <PrivateRoute
          exact
          path='/courses/:id/update'
          component={UpdateCourseWithContext}
        />
        <PrivateRoute exact path='/forbidden' component={Forbidden} />
        <Route path='/courses/:id' component={CourseDetailWithContext} />
        <Route path='/signin' component={UserSignInWithContext} />
        <Route path='/signup' component={UserSignUpWithContext} />
        <Route path='/signout' component={UserSignOutWithContext} />
        <Route path='/notfound' component={NotFound} />
        <Route path='/error' component={ErrorHandler} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </BrowserRouter>
);
