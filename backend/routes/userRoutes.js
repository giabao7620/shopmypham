const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// POST /auth/register
router.post("/register", userController.register);
// POST /users/create-admin
router.post("/create-admin", userController.createAdmin);
// GET /users
router.get("/", userController.getAllUsers);
// dang nhap
router.post("/login", userController.login);
// GET /users/:id
router.get("/:id", userController.getUserById);

// POST /users
router.post("/", userController.createUser);

// PUT /users/:id
router.put("/:id", userController.updateUser);

// DELETE /users/:id
router.delete("/:id", userController.deleteUser);

module.exports = router;
