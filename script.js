const form = document.getElementById("registrationForm");
const cardsContainer = document.getElementById("cardsContainer");
const tableBody = document.querySelector("#summaryTable tbody");
const toggleThemeBtn = document.getElementById("toggleTheme");


let editingCard = null;

// Load profiles from LocalStorage on page load
let profiles = JSON.parse(localStorage.getItem("profiles")) || [];
profiles.forEach(profile => createProfile(profile, false));

// Dark Mode Toggle
toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
// Validate Email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
// Clear errors
function clearErrors(form) {
    const errors = form.querySelectorAll(".error");
    errors.forEach(e => e.textContent = "");
}

// Save profiles to LocalStorage
function saveProfiles() {
    localStorage.setItem("profiles", JSON.stringify(profiles));
}

// Create or update profile card and table row
function createProfile(data, save = true) {
    let card, row;

    if (editingCard) {
        // UPDATE existing profile
        card = editingCard.card;
        row = editingCard.row;

        card.querySelector("h3").textContent = `${data.firstName} ${data.lastName}`;
        card.querySelector("p:nth-of-type(1)").textContent = `${data.programme} - Year ${data.year}`;
        card.querySelector("p:nth-of-type(2)").textContent = `Interests: ${data.interests || 'None'}`;
        card.querySelector("img").src = data.photo || 'https://via.placeholder.com/200';

        row.children[0].textContent = data.firstName;
        row.children[1].textContent = data.lastName;
        row.children[2].textContent = data.email;
        row.children[3].textContent = data.programme;
        row.children[4].textContent = data.year;
        row.children[5].textContent = data.interests || 'None';

        // Update profiles array
        const index = profiles.findIndex(p => p.id === editingCard.id);
        if(index !== -1) profiles[index] = data;

        editingCard = null;
    } else {
        // CREATE new profile
        data.id = Date.now(); // unique ID
        card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${data.photo || 'https://via.placeholder.com/200'}" alt="Profile Photo">
            <h3>${data.firstName} ${data.lastName}</h3>
            <p>${data.programme} - Year ${data.year}</p>
            <p>Interests: ${data.interests || 'None'}</p>
            <button class="editBtn">Edit</button>
            <button class="removeBtn">Remove</button>
        `;
        cardsContainer.appendChild(card);

        row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.firstName}</td>
            <td>${data.lastName}</td>
            <td>${data.email}</td>
            <td>${data.programme}</td>
            <td>${data.year}</td>
            <td>${data.interests || 'None'}</td>
            <td>
                <button class="editBtn">Edit</button>
                <button class="removeBtn">Remove</button>
            </td>
        `;
        tableBody.appendChild(row);

        // Add to profiles array
        if(save) {
            profiles.push(data);
            saveProfiles();
        }

        // REMOVE
        function removeHandler() {
            card.remove();
            row.remove();
            const index = profiles.findIndex(p => p.id === data.id);
            if(index !== -1) profiles.splice(index, 1);
            saveProfiles();
        }
        card.querySelector(".removeBtn").addEventListener("click", removeHandler);
        row.querySelector(".removeBtn").addEventListener("click", removeHandler);

        // EDIT
        function editHandler() {
            document.getElementById("firstName").value = data.firstName;
            document.getElementById("lastName").value = data.lastName;
            document.getElementById("email").value = data.email;
            document.getElementById("programme").value = data.programme;
            document.getElementById("year").value = data.year;
            document.getElementById("interests").value = data.interests;
            document.getElementById("photo").value = data.photo;
            editingCard = {card, row, id: data.id};
        }
        card.querySelector(".editBtn").addEventListener("click", editHandler);
        row.querySelector(".editBtn").addEventListener("click", editHandler);
    }
}
