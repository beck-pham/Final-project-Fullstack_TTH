import config from './config';

export default class Data  {
    api(path, method = 'GET', body = null, requestAuth = false, credentials = null) {
        const url = config.apiBaseUrl + path;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        };

        if (body !== null) {
            options.body = JSON.stringify(body);
        }
        
        if (requestAuth) {
            const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;
        }

        return fetch(url, options)
    }

    /**
     * Retrieves an authenticated user from the database.
     * @param { users email } emailAddress 
     * @param { users password } password 
     */
    async getUser(emailAddress,password) {
        const response = await this.api(`/users`, 'GET', null, true, { emailAddress, password });
        if (response.status === 200) {
            return response.json().then(data => data);
        } 
        else if (response.status === 401) {
          return null;
        } 
        else {
          throw new Error();
        }
    }

    /**
     *  Creates a new user in the database.
     * @param { user } user 
     */
    async createUser(user) {

        const response = await this.api('/users', 'POST', user);
        if (response.status === 201) {
            return [];
        }
        else if (response.status === 400 ) {
            return response.json().then(data => {
                console.log("create user data error: ", data.errors)
                return data.errors;
            })
        }
        else {
            throw new Error();
        }
    }

    /**
     * Gets all the courses stored in the the database as well the course owners information.
     */
    async getCourses() {
        const response = await this.api('/courses');
        if (response.status === 200) {
            return response.json().then(data => data)
        } 
        else if (response.status === 500) {
            throw new Error();
        }           
    }

    /**
     *  Gets a single course and its details from the database and the course owner information.
     * @param { course id } id 
     */
    async getSingleCourse(id) {
        const response = await this.api(`/courses/${id}`);
        if (response.status === 200) {
            return response.json().then(data => data)
        }
        else if (response.status === 404) {
            // return response.json().then(data => {
            //     console.log("get a course data error: ", data.errors)
            //     return data.errors;
            // })
            console.log("get single course 400 error")
            return null;
        }
        else {
            throw new Error();
        }
    }

    /**
     * Creates a new course and ties it to the user who created the course.
     * @param { new course } course 
     * @param { course owner email } emailAddress 
     * @param { course owner password } password 
     */
    async createCourse(course, emailAddress, password) {
        const response = await this.api('/courses', 'POST', course, true, { emailAddress, password });
        if (response.status === 201) {
            return [];
        } 
        else if (response.status === 400) {
            return response.json().then(data => {
                console.log("Create course data error: ", data.errors)
                return data.errors;
            });
        }
        else {
            throw new Error();
        }
    }

    /**
     * Updates an existing course. Course can only be updated by the user who created it.
     * @param { updated course } course 
     * @param { course owners email } emailAddress 
     * @param { course owners password } password 
     */
    async updateCourse(course, emailAddress, password) {
        const response = await this.api(`/courses/${course.id}`, 'PUT', course, true , { emailAddress, password });
        if (response.status === 204) {
            return [];
        }
        else if (response.status === 400) {
            return response.json().then(data => {
                console.log("Update course 400 status error : ", data.errors)
                return data.errors;
            }); 
        } else if (response.status === 403) {
            return response.json().then(data => {
                console.log("Update course 403 status error: ", data.errors)
                return data.errors;
            });
        }
         else {
            throw new Error();
        }
    }

    /**
     * Sends a delete request to the database to delete a course. 
     * @param { course to be deleted } course 
     * @param { users email } emailAddress 
     * @param { users password } password 
     */
    async deleteCourse(course, emailAddress, password) {
        const response = await this.api(`/courses/${course.id}`,'DELETE', course, true, { emailAddress, password });
        if (response.status === 204) {
            return [];
        }
        else if (response.status === 403)  {
            return response.json().then(data => {
                console.log("Delete course 403 status error: ", data.errors)
                return data.errors
            })
        } 
        else if (response.status === 404) { 
            return response.json().then(data => {
                console.log("Delete course 404 status error: ", data.errors)
                return data.errors
            })
        }
        else {
            throw new Error();
        }
    }
}


