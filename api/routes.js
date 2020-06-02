"use strict";

const express = require("express");
const router = express.Router();
const { User, Course } = require("./models");

const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const auth = require("basic-auth");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Middleware for User authentication
 */

const authenticateUser = asyncHandler(async (req, res, next) => {
  let message = null;
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  // If the user's credentials are available...
  if (credentials) {
    // Look for a user whose `username` matches the credentials `name` property.
    const users = await User.findAll();
    const user = users.find(user => user.emailAddress === credentials.name);
    // If a user was successfully retrieved from the data store...
    // Use the bcryptjs npm package to compare the user's password
    // (from the Authorization header) to the user's password
    // that was retrieved from the data store.
    if (user) {
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );
      // If the passwords match...
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.username}`);
        // Store the user on the Request ojbect
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.username}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }
  // If user authentication failed...
  if (message) {
    console.warn(message);
    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: "Access Denied" });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
});

/************
  USER ROUTE
***********/

//Route that returns a list of users
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    });
  })
);

//Route that creates a new user
router.post(
  "/users",
  [
    check("firstName")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage('Please provide a value for "First Name"'),
    check("lastName")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage('Please provide a value for "Last Name"'),
    check("emailAddress")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage('Please provide a value for "Email Address"'),
    check("password")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage('Please provide a value for "password"')
  ],
  asyncHandler(async (req, res) => {
    // Attempt to get the validation  result from the Request  object.
    const errors = validationResult(req);

    /**
     * isEmpty() returns true if there are no errors so to check if there are errors we use !(NOT operator)
     * If there are validation errors
     */
    if (!errors.isEmpty()) {
      const errorMessage = errors.array().map(error => error.msg);

      // return the error to the client
      return res.status(400).json({ errors: errorMessage });
    } else {
      // Get the user from the request body.
      const user = req.body;
      // Hash the new user's password.
      user.password = bcryptjs.hashSync(user.password);
      await User.create(user);
      console.log("User successfully created!");
      res
        .status(201)
        .location("/")
        .end();
    }
  })
);
/**
 * DELETE route. Deletes a user
 */
router.delete(
  "/users/:id",
  asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await User.destroy({
        where: {
          id: user.id
        }
      });
      res.status(204).end();
    } else {
      res.status(404).json({ message: "user not found" });
    }
  })
);

/**************
    COURSE ROUTE
*************/
/**
 *  Course GET: Gets a list of all the courses and users who owns each course.
 */
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      // Set attributes I want to bring back from the database.
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded"
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "emailAddress"]
        }
      ]
    });
    res.json(courses.map(course => course.get({ plain: true })));
  })
);

/**
 * Course GET: Gets a single course and the user who owns that course.
 */
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findOne({
        where: { id: req.params.id },
        attributes: [
          "id",
          "title",
          "description",
          "estimatedTime",
          "materialsNeeded"
        ],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "emailAddress"]
          }
        ]
      });
      if (course) {
        res.json(course);
        res.status(201).end();
      } else {
        res.status(404).json({ message: "Sorry that course does not exist" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

//Send a POST request to create a new course
router.post(
  "/courses",
  [
    check("title")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage('Please provide a value for "title"'),
    check("description")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage('Please provide a value for "description"'),
    check("estimatedTime")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage('Please provide a value for "Estimated time"')
  ],
  authenticateUser,
  asyncHandler(async (req, res) => {
    // Get the Id of the logged in user
    const user = req.currentUser;
    // Attempt get validation result from req obj
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array().map(error => error.msg);

      // return the error to the client
      return res.status(400).json({ errors: errorMessage });
    } else {
      if (parseInt(req.body.userId) === user.id) {
        const course = await Course.create(req.body);
        console.log("Course successfully created!");
        res
          .status(201)
          .location(`/courses/${course.id}`)
          .json();
      } else {
        return res.status(401).json({ message: "Access Denied" });
      }
    }
  })
);

//Send a PUT request to update a course
router.put(
  "/courses/:id",
  [
    check("title")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage('Please provide a value for "title"'),
    check("description")
      .exists({ checkFalsy: true, checkNull: true })
      .withMessage('Please provide a value for "description"')
  ],
  authenticateUser,
  asyncHandler(async (req, res) => {
    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);
    // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);
      // Return the validation errors to the client.
      res.status(400).json({ errors: errorMessages });
    } else {
      const course = await Course.findByPk(req.params.id);
      if (course) {
        await course.update(req.body);
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Course Not Found." });
      }
    }
  })
);

// //Send a POST request to delete a course
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if (course.userId !== user.id) {
      res.status(403).json({ message: "Course id does not match user id" });
    } else if (course) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Route not found" });
    }
  })
);

module.exports = router;
