// Example: lalabas yung alert pag clicking Login/Sign Up
document.querySelector(".login").addEventListener("click", () => {
  alert("Login button clicked!");
});

document.querySelector(".signup").addEventListener("click", () => {
  alert("Sign Up button clicked!");
});

// ---------- SIGN UP ----------

if (document.getElementById("signupForm")) {
  document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    let user = { username, email, password, profile: {} };
    localStorage.setItem("user", JSON.stringify(user));
    
    alert("Sign up successful! You can now log in.");
    window.location.href = "login.html";
  });
}

// ---------- LOGIN ----------

if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    let loginUser = document.getElementById("loginUser").value;
    let loginPass = document.getElementById("loginPass").value;
    
    let user = JSON.parse(localStorage.getItem("user"));
    
    if (user && (user.username === loginUser || user.email === loginUser) && user.password === loginPass) {
      alert("Login successful!");
      localStorage.setItem("loggedIn", "true");
      window.location.href = "profile.html";
    } else {
      alert("Invalid username/email or password.");
    }
  });
}

// ---------- PROFILE ----------

if (document.getElementById("profileForm")) {
  let user = JSON.parse(localStorage.getItem("user"));
  
  if (!localStorage.getItem("loggedIn")) {
    alert("Please log in first.");
    window.location.href = "/login.html";
  }
  
  // Load profile data if exists
  
  if (user.profile) {
    document.getElementById("name").value = user.profile.name || "";
    document.getElementById("strand").value = user.profile.strand || "";
    document.getElementById("interests").value = user.profile.interests || "";
  }
  
  document.getElementById("profileForm").addEventListener("submit", function(e) {
    e.preventDefault();
    user.profile = {
      name: document.getElementById("name").value,
      strand: document.getElementById("strand").value,
      interests: document.getElementById("interests").value
    };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profile updated successfully!");
  });
}

// ---------- LOGOUT ----------

let logoutBtn = document.querySelector(".logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  });
}

// ---------- DASHBOARD ----------

if (document.querySelector(".dashboard")) {
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user || !localStorage.getItem("loggedIn")) {
    alert("Please log in first.");
    window.location.href = "login.html";
  }
  
  // Welcome message
  
  let welcome = document.getElementById("welcomeMsg");
  if (user.profile && user.profile.name) {
    welcome.textContent = `Hi ${user.profile.name}, here are your career options!`;
  } else {
    welcome.textContent = `Hi ${user.username}, here are your career options!`;
  }
  
  // Save to My Choices
  
  document.querySelectorAll(".saveBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      let choice = btn.dataset.item;
      
      if (!user.saved) user.saved = [];
      if (!user.saved.includes(choice)) {
        user.saved.push(choice);
        localStorage.setItem("user", JSON.stringify(user));
        alert(choice + " saved to your choices!");
      } else {
        alert(choice + " is already saved.");
      }
    });
  });
}

// ---------- PROFILE: Display Saved Items ----------

if (document.getElementById("savedList")) {
  let user = JSON.parse(localStorage.getItem("user"));
  let list = document.getElementById("savedList");
  list.innerHTML = "";
  
  if (user && user.saved && user.saved.length > 0) {
    user.saved.forEach(item => {
      let li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  } else {
    list.innerHTML = "<li>No saved items yet.</li>";
  }
}

// ========== ADMIN PANEL FUNCTIONS ==========

// Manage Users

function loadUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const usersTable = document.querySelector("#usersTable tbody");
  if (usersTable) {
    usersTable.innerHTML = "";
    users.forEach((u, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td>
          <button onclick="deleteUser(${index})">Delete</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  }
}

function deleteUser(index) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  loadUsers();
}

// Manage Courses

function loadCourses() {
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const courseList = document.getElementById("courseList");
  if (courseList) {
    courseList.innerHTML = "";
    courses.forEach((c, i) => {
      const li = document.createElement("li");
      li.innerHTML = `${c.name} - ${c.desc} 
        <button onclick="deleteCourse(${i})">Delete</button>`;
      courseList.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("addCourseBtn")) {
    document.getElementById("addCourseBtn").addEventListener("click", () => {
      const name = document.getElementById("courseName").value;
      const desc = document.getElementById("courseDesc").value;
      if (!name || !desc) return alert("Enter course details!");
      const courses = JSON.parse(localStorage.getItem("courses")) || [];
      courses.push({ name, desc });
      localStorage.setItem("courses", JSON.stringify(courses));
      loadCourses();
    });
  }
});

function deleteCourse(i) {
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  courses.splice(i, 1);
  localStorage.setItem("courses", JSON.stringify(courses));
  loadCourses();
}

// Manage Jobs

function loadJobs() {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const jobList = document.getElementById("jobList");
  if (jobList) {
    jobList.innerHTML = "";
    jobs.forEach((j, i) => {
      const li = document.createElement("li");
      li.innerHTML = `${j.name} - <a href="${j.link}" target="_blank">Apply</a> 
        <button onclick="deleteJob(${i})">Delete</button>`;
      jobList.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("addJobBtn")) {
    document.getElementById("addJobBtn").addEventListener("click", () => {
      const name = document.getElementById("jobName").value;
      const link = document.getElementById("jobLink").value;
      if (!name || !link) return alert("Enter job details!");
      const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
      jobs.push({ name, link });
      localStorage.setItem("jobs", JSON.stringify(jobs));
      loadJobs();
    });
  }
});

function deleteJob(i) {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  jobs.splice(i, 1);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  loadJobs();
}

// Analytics (Career Path popularity)

function loadAnalytics() {
  const savedChoices = JSON.parse(localStorage.getItem("savedChoices")) || [];
  const counts = {};
  savedChoices.forEach(choice => {
    counts[choice] = (counts[choice] || 0) + 1;
  });
  
  const ctx = document.getElementById("analyticsChart");
  if (ctx) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(counts),
        datasets: [{
          label: "Number of Users Choosing This Career",
          data: Object.values(counts),
          backgroundColor: "rgba(54, 162, 235, 0.6)"
        }]
      }
    });
  }
}

// Run Admin Functions

document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  loadCourses();
  loadJobs();
  loadAnalytics();
});

// ========== CAREER QUIZ ==========
document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.getElementById("quizForm");
  if (quizForm) {
    quizForm.addEventListener("submit", e => {
      e.preventDefault();
      const answers = {
        q1: quizForm.q1.value,
        q2: quizForm.q2.value
      };
      
      let result = "Suggested Career Path:<br>";
      if (answers.q1 === "coder") result += "💻 BSIT / BSCS - Software Developer";
      if (answers.q2 === "problem") result += "<br>🔧 IT Support / Data Analyst";
      
      document.getElementById("quizResult").innerHTML = result;
    });
  }
});

// ========== RESUME BUILDER ==========
const resumeForm = document.getElementById("resumeForm");
if (resumeForm) {
  resumeForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const skills = document.getElementById("skills").value;
    const exp = document.getElementById("experience").value;
    
    const resume = `
      <h2>${name}</h2>
      <p>Email: ${email}</p>
      <h3>Skills</h3>
      <p>${skills}</p>
      <h3>Experience</h3>
      <p>${exp || "No experience yet"}</p>
    `;
    
    document.getElementById("resumeOutput").innerHTML = resume;
  });
}

// ========== INTERNSHIP LISTINGS ==========
const internshipList = document.getElementById("internshipList");
if (internshipList) {
  const internships = [
    { name: "Web Developer Intern", company: "Globe Telecom", link: "#" },
    { name: "IT Support Intern", company: "Smart Communications", link: "#" },
    { name: "Data Analyst Intern", company: "Accenture PH", link: "#" }
  ];
  
  internships.forEach(i => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${i.name}</b> - ${i.company} | <a href="${i.link}" target="_blank">Apply</a>`;
    internshipList.appendChild(li);
  });
}

// ========== COMMUNITY FORUM ==========
const forumForm = document.getElementById("forumForm");
if (forumForm) {
  forumForm.addEventListener("submit", e => {
    e.preventDefault();
    const post = document.getElementById("forumPost").value;
    const posts = JSON.parse(localStorage.getItem("forumPosts")) || [];
    posts.push(post);
    localStorage.setItem("forumPosts", JSON.stringify(posts));
    loadForumPosts();
    forumForm.reset();
  });
}

function loadForumPosts() {
  const posts = JSON.parse(localStorage.getItem("forumPosts")) || [];
  const forumPosts = document.getElementById("forumPosts");
  if (forumPosts) {
    forumPosts.innerHTML = "";
    posts.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("forum-post");
      div.innerText = p;
      forumPosts.appendChild(div);
    });
  }
}
document.addEventListener("DOMContentLoaded", loadForumPosts);

