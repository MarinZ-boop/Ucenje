// Lista korisnika
const message = document.getElementById('message');
const user = users.find(u => u.email === email && u.password === password);
if(user) {
localStorage.setItem('loggedInUser', JSON.stringify(user));
if(user.role === 'owner') window.location.href = 'owner.html';
else window.location.href = 'home.html';
} else {
message.textContent = 'Pogrešan email ili lozinka';
}
}


// Dodavanje predmeta
function addSubject() {
const name = document.getElementById('subject-name').value.trim();
if(name === "") return alert("Unesi naziv predmeta");
subjects.push({name, lessons: []});
const select = document.getElementById('subject-select');
const option = document.createElement('option');
option.value = name;
option.textContent = name;
select.appendChild(option);
document.getElementById('subject-name').value = '';
}


// Dodavanje lekcije
function addLesson() {
const title = document.getElementById('lesson-title').value;
const text = document.getElementById('lesson-text').value;
const selectedSubject = document.getElementById('subject-select').value;
if(!selectedSubject) return alert("Odaberi predmet");


const subject = subjects.find(s => s.name === selectedSubject);
subject.lessons.push({title, text, cards: generateCards(text)});
displayLessons(selectedSubject);


document.getElementById('lesson-title').value = '';
document.getElementById('lesson-text').value = '';
}


// Prikaz lekcija
function displayLessons(subjectName) {
const container = document.getElementById('lessons-container');
container.innerHTML = '';
const subject = subjects.find(s => s.name === subjectName);
if(!subject) return;


subject.lessons.forEach(lesson => {
const div = document.createElement('div');
div.innerHTML = `<h3>${lesson.title}</h3><p>${lesson.text}</p>`;


// Kartice za učenje
const cardDiv = document.createElement('div');
cardDiv.innerHTML = '<h4>Kartice za učenje:</h4>';
lesson.cards.forEach(c => { cardDiv.innerHTML += `<p>${c}</p>`; });
div.appendChild(cardDiv);


container.appendChild(div);
});
}


// AI kartice (jednostavno dijeli tekst po rečenicama)
function generateCards(text) {
return text.split('.').filter(s => s.trim().length > 0).map(s => s.trim());
}


// Provjera login i prikaz lekcija pri učitavanju
document.addEventListener('DOMContentLoaded', () => {
const user = JSON.parse(localStorage.getItem('loggedInUser'));
if(!user) window.location.href = 'index.html';
if(document.getElementById('lessons-container') && document.getElementById('subject-select').value !== '') {
displayLessons(document.getElementById('subject-select').value);
}
});
