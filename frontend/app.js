const API_URL = '/api/students';
let allStudents = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchStudents();

  const form = document.getElementById('student-form');
  const searchInput = document.getElementById('search-input');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('student-id').value;
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const course = document.getElementById('course').value.trim();
    const errorSpan = document.getElementById('form-error');

    // Validation
    if (!name || !course || !email) {
      errorSpan.textContent = 'All fields are required.';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorSpan.textContent = 'Please enter a valid email address.';
      return;
    }
    errorSpan.textContent = ''; // clear error

    if (id) {
      await updateStudent(id, { name, email, course });
    } else {
      await addStudent({ name, email, course });
    }
    
    resetForm();
  });

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allStudents.filter(s => 
      s.name.toLowerCase().includes(searchTerm) || 
      s.course.toLowerCase().includes(searchTerm)
    );
    renderStudents(filtered);
  });
});

function resetForm() {
  document.getElementById('student-form').reset();
  document.getElementById('student-id').value = '';
  document.getElementById('form-title').textContent = 'Add New Student';
  document.getElementById('submit-btn').textContent = 'Add Student';
  document.getElementById('form-error').textContent = '';
}

async function fetchStudents() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch students');
    allStudents = await res.json();
    renderStudents(allStudents);
  } catch (error) {
    console.error(error);
  }
}

async function addStudent(student) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(student)
    });
    if (!res.ok) throw new Error('Failed to add student');
    await fetchStudents();
  } catch (error) {
    console.error(error);
  }
}

async function updateStudent(id, student) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(student)
    });
    if (!res.ok) throw new Error('Failed to update student');
    await fetchStudents();
  } catch (error) {
    console.error(error);
  }
}

async function deleteStudent(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete student');
    await fetchStudents();
  } catch (error) {
    console.error(error);
  }
}

function startEdit(id) {
  const student = allStudents.find(s => s._id === id);
  if (!student) return;

  document.getElementById('student-id').value = student._id;
  document.getElementById('name').value = student.name;
  document.getElementById('email').value = student.email;
  document.getElementById('course').value = student.course;

  document.getElementById('form-title').textContent = 'Edit Student';
  document.getElementById('submit-btn').textContent = 'Update Student';
  document.getElementById('form-error').textContent = '';

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderStudents(studentsToRender) {
  const container = document.getElementById('students-container');
  container.innerHTML = '';
  
  if (studentsToRender.length === 0) {
    container.innerHTML = '<p style="color: rgba(255,255,255,0.7); grid-column: 1/-1;">No students found.</p>';
    return;
  }

  studentsToRender.forEach(student => {
    const card = document.createElement('div');
    card.className = 'student-card';
    
    // SVG for Delete icon
    const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
      <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
    </svg>`;

    // SVG for Edit icon
    const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
    </svg>`;

    card.innerHTML = `
      <div class="info">
        <h3>${escapeHTML(student.name)}</h3>
        <p>${escapeHTML(student.email)}</p>
        <span class="course-badge">${escapeHTML(student.course)}</span>
      </div>
      <div class="card-actions">
        <button class="edit-btn" onclick="startEdit('${student._id}')" title="Edit Student">
          ${editIcon}
        </button>
        <button class="delete-btn" onclick="deleteStudent('${student._id}')" title="Delete Student">
          ${trashIcon}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
