// ---- DEFINIRANI KORISNICI ----
const users = [
  {email: "marinzoric29@gmail.com", password: "ownerpass", role: "owner"},
  {email: "user1@test.com", password: "pass1", role: "user"}
];

// ---- PREDMETI I LEKCIJE (pohranjeni u localStorage) ----
function getSubjects() {
  return JSON.parse(localStorage.getItem("subjects")) || [];
}

function saveSubjects(subjects) {
  localStorage.setItem("subjects", JSON.stringify(subjects));
}

// ---- LOGIN ----
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = users.find(u => u.email === email && u.password === password);

  if(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    if(user.role === "owner") window.location.href = "owner.html";
    else window.location.href = "home.html";
  } else {
    document.getElementById("message").textContent = "Pogrešan email ili lozinka!";
  }
}

// ---- LOGOUT ----
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// ---- DODAVANJE PREDMETA ----
function addSubject() {
  const name = document.getElementById("subject-name").value.trim();
  if(name === "") return alert("Unesi naziv predmeta");

  const subjects = getSubjects();
  if(subjects.some(s => s.name === name)) return alert("Predmet već postoji!");

  subjects.push({name, lessons: []});
  saveSubjects(subjects);

  loadSubjects();
  document.getElementById("subject-name").value = "";
}

// ---- DODAVANJE LEKCIJE ----
function addLesson() {
  const title = document.getElementById("lesson-title").value;
  const text = document.getElementById("lesson-text").value;
  const selectedSubject = document.getElementById("subject-select").value;

  if(!selectedSubject) return alert("Odaberi predmet");

  const subjects = getSubjects();
  const subject = subjects.find(s => s.name === selectedSubject);

  subject.lessons.push({title, text, cards: generateCards(text)});
  saveSubjects(subjects);

  displayLessons(selectedSubject);

  document.getElementById("lesson-title").value = "";
  document.getElementById("lesson-text").value = "";
}

// ---- PRIKAZ PREDMETA ----
function loadSubjects() {
  const subjects = getSubjects();
  const select = document.getElementById("subject-select");
  if(!select) return;

  select.innerHTML = '<option value="">Odaberi predmet</option>';
  subjects.forEach(s => {
    const option = document.createElement("option");
    option.value = s.name;
    option.textContent = s.name;
    select.appendChild(option);
  });
}

// ---- PRIKAZ LEKCIJA ----
function displayLessons(subjectName) {
  const container = document.getElementById("lessons-container");
  if(!container) return;

  container.innerHTML = "";
  const subjects = getSubjects();
  const subject = subjects.find(s => s.name === subjectName);
  if(!subject) return;

  subject.lessons.forEach(lesson => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${lesson.title}</h3><p>${lesson.text}</p>`;

    const cardDiv = document.createElement("div");
    cardDiv.innerHTML = "<h4>Kartice za učenje:</h4>";
    lesson.cards.forEach(c => {
      cardDiv.innerHTML += `<p>${c}</p>`;
    });

    div.appendChild(cardDiv);
    container.appendChild(div);
  });
}

// ---- AI KARTICE ----
function generateCards(text) {
  return text.split(".")
             .filter(s => s.trim().length > 0)
             .map(s => s.trim());
}

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if(!user && window.location.pathname.includes("html")) {
    window.location.href = "index.html";
  }
  loadSubjects();
});
