const userService = require("../../src/services/user.service");
const User = require("../../src/models/user.model");
const bcrypt = require("bcrypt");
const { clearDatabase } = require("../setupTests");

// beforeEach(async () => {
//   await clearDatabase();
// });

// Skip these tests since the users are managed by AWS now
describe.skip("👤 User Service Tests", () => {
  test("Should register a new user", async () => {
    const user = await userService.registerUser({ username: "testUser", email: "test@example.com", password: "password123" });
    expect(user).toBeDefined();
    expect(user.username).toBe("testUser");
    expect(user.email).toBe("test@example.com");
    const isPasswordValid = await bcrypt.compare("password123", user.password);
    expect(isPasswordValid).toBe(true);
  });

  test("Should fail to register duplicate user", async () => {
    await userService.registerUser({ username: "testUser", email: "test@example.com", password: "password123" });

    await expect(userService.registerUser({ username: "testUser", email: "test@example.com", password: "password123" }))
      .rejects.toThrow("User with this email or username already exists");
  });

  test("Should login a user", async () => {
    await userService.registerUser({ username: "testUser", email: "test@example.com", password: "password123" });
    const user = await userService.loginUser({ email: "test@example.com", password: "password123" });
    expect(user).toBeDefined();
    expect(user.username).toBe("testUser");
  });

  test("Should fail to login with incorrect password", async () => {
    await userService.registerUser({ username: "testUser", email: "test@example.com", password: "password123" });

    await expect(userService.loginUser({ email: "test@example.com", password: "wrongPassword" }))
      .rejects.toThrow("Invalid email or password");
  });

  test("Should update user details", async () => {
    const user = await userService.registerUser({ username: "testUser", email: "test@example.com", password: "password123" });
    const updatedUser = await userService.updateUser(user._id, { username: "updatedUser" });
    expect(updatedUser.username).toBe("updatedUser");
  });

  test("Should delete a user", async () => {
    const user = await userService.registerUser({ username: "testUser", email: "test@example.com", password: "password123" });
    await userService.deleteUser(user._id);
    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });
});