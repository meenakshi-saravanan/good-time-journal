const bcrypt = require("bcrypt");
const db = require("../database/db");

const SALT_ROUNDS = 10;

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

function createSession(req, user, res, message) {
  req.session.userId = user.id;
  req.session.user = publicUser(user);

  res.json({
    message,
    user: publicUser(user)
  });
}

async function signup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      error: "Name, email, and password are required."
    });
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    db.run(
      `INSERT INTO users (
        name,
        email,
        password_hash
      ) VALUES (?, ?, ?)`,
      [name.trim(), email.trim().toLowerCase(), passwordHash],
      function handleInsert(err) {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            res.status(409).json({
              error: "An account with this email already exists."
            });
            return;
          }

          res.status(500).json({ error: "Unable to create account." });
          return;
        }

        createSession(
          req,
          {
            id: this.lastID,
            name: name.trim(),
            email: email.trim().toLowerCase()
          },
          res,
          "Account created successfully"
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Unable to create account." });
  }
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      error: "Email and password are required."
    });
    return;
  }

  db.get(
    `SELECT
      id,
      name,
      email,
      password_hash
    FROM users
    WHERE email = ?`,
    [email.trim().toLowerCase()],
    async (err, user) => {
      if (err) {
        res.status(500).json({ error: "Unable to log in." });
        return;
      }

      if (!user) {
        res.status(401).json({ error: "Invalid email or password." });
        return;
      }

      const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!passwordMatches) {
        res.status(401).json({ error: "Invalid email or password." });
        return;
      }

      createSession(req, user, res, "Login successful");
    }
  );
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Unable to log out." });
      return;
    }

    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
}

function me(req, res) {
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  res.json(req.session.user);
}

module.exports = {
  signup,
  login,
  logout,
  me
};
