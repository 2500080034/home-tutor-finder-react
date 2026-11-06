
import { useState } from "react";
import "./App.css";

const tutors = [
  { id: 1, name: "Priya Sharma", subject: "Mathematics", city: "Karimnagar", price: 500, rating: 4.8 },
  { id: 2, name: "Rahul Kumar", subject: "Physics", city: "Hyderabad", price: 600, rating: 4.6 },
  { id: 3, name: "Anjali Reddy", subject: "English", city: "Warangal", price: 400, rating: 4.5 },
  { id: 4, name: "Suresh Babu", subject: "Chemistry", city: "Khammam", price: 550, rating: 4.7 }
];

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const registeredUsers = JSON.parse(localStorage.getItem("users")) || [];

  function login(e) {
    e.preventDefault();

    // Demo admin account
    if (email === "admin@tutor.com" && password === "Admin123") {
      enterApp({ name: "Admin", email, role: "admin" });
      return;
    }

    const found = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      enterApp(found);
    } else {
      setMessage("Invalid email or password. Please register first.");
    }
  }

  function register(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("Please fill all the fields.");
      return;
    }

    if (registeredUsers.some((u) => u.email === email)) {
      setMessage("This email is already registered.");
      return;
    }

    const newUser = { name, email, password, role: "user" };
    localStorage.setItem("users", JSON.stringify([...registeredUsers, newUser]));
    enterApp(newUser);
  }

  function enterApp(account) {
    localStorage.setItem("currentUser", JSON.stringify(account));
    setUser(account);
    setPage(account.role === "admin" ? "admin" : "home");
    setMessage("");
  }

  function logout() {
    localStorage.removeItem("currentUser");
    setUser(null);
    setPage("login");
    setEmail("");
    setPassword("");
  }

  const filteredTutors = tutors.filter((tutor) =>
    `${tutor.name} ${tutor.subject} ${tutor.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>📚 Home Tutor Finder</h1>
          <p>Find the right tutor for your learning journey.</p>

          <div className="auth-tabs">
            <button onClick={() => { setPage("login"); setMessage(""); }}>
              Login
            </button>
            <button onClick={() => { setPage("register"); setMessage(""); }}>
              Sign Up
            </button>
          </div>

          <form onSubmit={page === "register" ? register : login}>
            {page === "register" && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="primary-btn" type="submit">
              {page === "register" ? "Create Account" : "Login"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <p className="demo">
            Admin demo login:<br />
            admin@tutor.com<br />
            Admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="navbar">
        <h2>📚 Home Tutor Finder</h2>
        <nav>
          <button onClick={() => setPage(user.role === "admin" ? "admin" : "home")}>
            Home
          </button>
          {user.role === "user" && (
            <button onClick={() => setPage("tutors")}>Find Tutors</button>
          )}
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      {user.role === "admin" ? (
        <main className="container">
          <h1>Welcome, Admin!</h1>
          <p>Admin Dashboard – Manage the Home Tutor Finder application.</p>

          <div className="dashboard">
            <div className="dashboard-card">
              <h2>{registeredUsers.length}</h2>
              <p>Registered Users</p>
            </div>
            <div className="dashboard-card">
              <h2>{tutors.length}</h2>
              <p>Available Tutors</p>
            </div>
          </div>

          <h2>Registered Users</h2>
          {registeredUsers.length === 0 ? (
            <p>No users registered yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredUsers.map((u, index) => (
                    <tr key={index}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      ) : (
        <main className="container">
          {page === "home" && (
            <section className="hero">
              <h1>Find Your Perfect Home Tutor</h1>
              <p>Learn better with experienced and qualified tutors.</p>
              <button className="primary-btn" onClick={() => setPage("tutors")}>
                Find a Tutor
              </button>
            </section>
          )}

          {page === "tutors" && (
            <section>
              <h1>Available Tutors</h1>
              <input
                className="search"
                type="text"
                placeholder="Search by name, subject or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="tutor-grid">
                {filteredTutors.map((tutor) => (
                  <div className="tutor-card" key={tutor.id}>
                    <div className="tutor-icon">👩‍🏫</div>
                    <h2>{tutor.name}</h2>
                    <p>Subject: {tutor.subject}</p>
                    <p>Location: {tutor.city}</p>
                    <p>Fee: ₹{tutor.price}/hour</p>
                    <p>⭐ {tutor.rating}</p>
                    <button
                      className="primary-btn"
                      onClick={() => alert("You selected " + tutor.name)}
                    >
                      Contact Tutor
                    </button>
                  </div>
                ))}
                {filteredTutors.length === 0 && <p>No tutors found.</p>}
              </div>
            </section>
          )}

          <section className="about">
            <h2>About Home Tutor Finder</h2>
            <p>
              Home Tutor Finder helps students connect with tutors for
              Mathematics, Physics, English, Chemistry and other subjects.
            </p>
            <h2>Welcome, {user.name}!</h2>
            <p>You are logged in as a User.</p>
          </section>
        </main>
      )}

      <footer>
        <p>© 2026 Home Tutor Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
