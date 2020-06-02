import config from "./config";

export default class Data {
  api(
    path,
    method = "GET",
    body = null,
    requestAuth = false,
    credentials = null
  ) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requestAuth) {
      const encodedCredentials = btoa(
        `${credentials.emailAddress}:${credentials.password}`
      );
      options.headers["Authorization"] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }
  /**
   * The getUser() and createUser() methods perform the async operations that create and get an authenticated user of our app, using the api() method.
   * getUser() makes a GET request to the /users endpoint, and returns a JSON object containing user credentials
   * createUser() makes a POST request, sending new user data to the /users endpoint.
   */
  async getUser(emailAddress, password) {
    const response = await this.api(`/users`, "GET", null, true, {
      emailAddress,
      password
    });
    if (response.status === 200) {
      return response.json().then(data => data);
    } else if (response.status === 401) {
      return null;
    } else {
      throw new Error();
    }
  }

  async createUser(user) {
    const response = await this.api("/users", "POST", user);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => {
        console.log("create user data error: ", data.errors);
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  /**
   * COURSE METHOD
   */
  async getCourses() {
    const response = await this.api("/courses");
    if (response.status === 200) {
      return response.json().then(data => data);
    } else if (response.status === 500) {
      throw new Error();
    }
  }

  async getSingleCourse(id) {
    const response = await this.api(`/courses/${id}`);
    if (response.status === 200) {
      return response.json().then(data => data);
    } else if (response.status === 404) {
      // return response.json().then(data => {
      //     console.log("get a course data error: ", data.errors)
      //     return data.errors;
      // })
      console.log("get single course 400 error");
      return null;
    } else {
      throw new Error();
    }
  }

  async createCourse(course, emailAddress, password) {
    const response = await this.api("/courses", "POST", course, true, {
      emailAddress,
      password
    });
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => {
        console.log("Create course data error: ", data.errors);
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  async updateCourse(course, emailAddress, password) {
    const response = await this.api(
      `/courses/${course.id}`,
      "PUT",
      course,
      true,
      { emailAddress, password }
    );
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => {
        console.log("Update course 400 status error : ", data.errors);
        return data.errors;
      });
    } else if (response.status === 403) {
      return response.json().then(data => {
        console.log("Update course 403 status error: ", data.errors);
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  async deleteCourse(course, emailAddress, password) {
    const response = await this.api(
      `/courses/${course.id}`,
      "DELETE",
      course,
      true,
      { emailAddress, password }
    );
    if (response.status === 204) {
      return [];
    } else if (response.status === 403) {
      return response.json().then(data => {
        console.log("Delete course 403 status error: ", data.errors);
        return data.errors;
      });
    } else if (response.status === 404) {
      return response.json().then(data => {
        console.log("Delete course 404 status error: ", data.errors);
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }
}
