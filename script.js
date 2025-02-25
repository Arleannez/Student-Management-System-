// Get form elements by their IDs
const recordForm = document.getElementById('record-form');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const emailInput = document.getElementById('email');
const recordList = document.getElementById('record-list');
const idInput = document.getElementById('id');
const editIndexInput = document.getElementById('edit-index');

// Modal elements
const editModal = document.getElementById('editModal');
const editNameInput = document.getElementById('edit-name');
const editAgeInput = document.getElementById('edit-age');
const editEmailInput = document.getElementById('edit-email');

// Load records from localStorage (if any)
let records = JSON.parse(localStorage.getItem('records')) || [];

function isDuplicateEmail(email) {
    return records.some(record => record.email.toLowerCase() === email.toLowerCase());
}

// Function to check if an email is already in the records
function isDuplicateId(id) {
    return records.some(record => record.id === id);
}

function isDuplicateName(name) {
    return records.some(record => record.name.toLowerCase() === name.toLowerCase());
}

// Function to display records in the table
function displayRecords(query = "") {
  recordList.innerHTML = ""; // Clear previous content

  // Filter records based on search query
  let filteredRecords = records.filter(record =>
      record.name.toLowerCase().includes(query)
  );

  if (filteredRecords.length === 0) {
      recordList.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">No Record Found</td></tr>`;
  } else {
      filteredRecords.forEach((record, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${record.name}</td>
              <td>${record.age}</td>
              <td>${record.id}</td>
              <td>${record.email}</td>
              <td><button onclick="openEditModal(${index})"><i class="fas fa-edit"></i> Edit</button></td>
              <td class="deleteButton"><button onclick="deleteRecord(${index})"><i class="fas fa-trash"></i> Delete</button></td>
          `;
          recordList.appendChild(row);
      });
  }
}

// Handle form submission (Add or Edit record)
recordForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevents page refresh
  const name = nameInput.value;
  const age = ageInput.value;
  const email = emailInput.value;
  const editIndex = parseInt(editIndexInput.value);

  if (name && age && email) {
    if (isDuplicateEmail(email) && editIndex === -1) {
      alert('Email is already used.');
      return;
    }
    if (isDuplicateName(name) && editIndex === -1) {
      alert('Name is already used.');
      return;
    }
    if (isDuplicateId(idInput.value ) && editIndex === -1) {
      alert('ID is already used.');
      return;
    }

    if (editIndex === -1) {
      records.push({ id: idInput.value, name, age, email });
    } else {
      records[editIndex] = { name, age, email };
      editIndexInput.value = -1; // Reset edit index
    }

    localStorage.setItem('records', JSON.stringify(records));
    displayRecords(); // Update table immediately
    nameInput.value = '';
    ageInput.value = '';
    emailInput.value = '';
    let delBtn = document.querySelectorAll('.deleteButton');
    const recordIndex = records.length - 1; // Get index of newly added record
    delBtn[recordIndex].innerHTML = `<i id="yesBtn" onclick="confirmDelete(${recordIndex})" class="fa-solid fa-check"></i><i id="noBtn" onclick="resetDelete(${recordIndex})" class="fa-solid fa-xmark"></i>`;
  }
});

// Function to open the edit modal
function openEditModal(index) {
    const recordToEdit = records[index];
    document.getElementById('edit-id').value = recordToEdit.id; // Populate ID field
    editNameInput.value = recordToEdit.name;
    editAgeInput.value = recordToEdit.age;
    editEmailInput.value = recordToEdit.email;
    editIndexInput.value = index; // Store index for updating
    editModal.style.display = "block"; // Show the modal
}

// Function to close the modal
function closeModal() {
    editModal.style.display = "none"; // Hide the modal
}

// Handle the edit form submission
document.getElementById('edit-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevents page refresh
    const index = parseInt(editIndexInput.value);
    records[index].id = document.getElementById('edit-id').value; // Save ID
    records[index].name = editNameInput.value;
    records[index].age = editAgeInput.value;
    records[index].email = editEmailInput.value;

    localStorage.setItem('records', JSON.stringify(records));
    displayRecords(); // Display records after saving changes
    closeModal(); // Close the modal after saving changes
});

// Function to delete a record with confirmation
function deleteRecord(index) {
    displayRecords();
    let delBtn = document.querySelectorAll('.deleteButton');
    delBtn[index].innerHTML = `<i id="yesBtn" onclick="confirmDelete(${index})" class="fa-solid fa-check"></i><i id="noBtn" onclick="resetDelete(${index})" class="fa-solid fa-xmark"></i>`;
}

// Confirm and remove the record
function confirmDelete(index) {
    records.splice(index, 1); // Remove from array
    try {
        localStorage.setItem('records', JSON.stringify(records)); // Update storage
    } catch (e) {
        alert('Failed to save records to localStorage. Please try again.');
    }
    displayRecords();
}

// Cancel deletion and refresh table
function resetDelete(index) {
    displayRecords();
}

// Toggle theme (dark/light mode)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-theme');
    }
});

// Search records by name
document.getElementById("search").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    displayRecords(query);
});

// Sorting order tracker
let sortOrder = { name: "asc", age: "asc" };

// Function to sort records by name or age
function sortRecords(key) {
    records.sort((a, b) => {
        if (key === "age") {
            return sortOrder[key] === "asc" ? a.age - b.age : b.age - a.age;
        } else {
            return sortOrder[key] === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }
    });
    sortOrder[key] = sortOrder[key] === "asc" ? "desc" : "asc";
    displayRecords();
}

// Initial display when page loads
displayRecords();
