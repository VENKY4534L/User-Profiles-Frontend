// Data storage
      let users = [];
      let currentUserId = null;
      let isEditing = false;

      // Initialize app
      function init() {
        console.log("Initializing User Profiles Manager...");
        loadUsers();
        setupEventListeners();
        populateYearDropdowns();
        populateStateCountryDropdowns();
        console.log("Initialization complete. Users loaded:", users.length);
      }

      // Load users from browser storage
      function loadUsers() {
        const storedUsers = getStoredUsers();
        if (storedUsers.length === 0) {
          // Add default users
          users = [
            {
              id: 1,
              name: "Dave Richards",
              email: "dave@mail.com",
              contact: "+91 8332883854",
              firstName: "Dave",
              lastName: "Richards",
              yearOfBirth: "1990",
              gender: "male",
              phoneNumber: "8332883854",
              altPhoneNumber: "",
              emailId: "dave@mail.com",
              address: "",
              pincode: "",
              domicileState: "",
              domicileCountry: "",
              schoolCollege: "",
              degree: "",
              course: "",
              completionYear: "",
              grade: "",
              skills: "",
              projects: "",
              domain1: "",
              subdomain1: "",
              experience1: "",
              linkedinUrl: "",
              resumeFile: "myresume.pdf",
            },
            {
              id: 2,
              name: "Abhishek Hari",
              email: "hari@mail.com",
              contact: "+91 9876543210",
              firstName: "Abhishek",
              lastName: "Hari",
            },
            {
              id: 3,
              name: "Nishta Gupta",
              email: "nishta@mail.com",
              contact: "+91 9123456789",
              firstName: "Nishta",
              lastName: "Gupta",
            },
          ];
          saveUsers();
        } else {
          users = storedUsers;
        }
        renderUsers();
      }

      // Get users from variable storage
      function getStoredUsers() {
        return users;
      }

      // Save users
      function saveUsers() {
        // Data is already in the users array
        renderUsers();
      }

      // Render users table
      function renderUsers() {
        const tbody = document.getElementById("usersTableBody");
        const emptyState = document.getElementById("emptyState");
        const table =
          document.getElementById("usersTable").parentElement.parentElement;

        if (users.length === 0) {
          emptyState.style.display = "block";
          table.style.display = "none";
        } else {
          emptyState.style.display = "none";
          table.style.display = "block";

          tbody.innerHTML = users
            .map(
              (user, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <div class="action-icons">
                                <button class="action-icon" onclick="viewUser(${
                                  user.id
                                })" aria-label="View user">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </button>
                                <button class="action-icon" onclick="deleteUser(${
                                  user.id
                                })" aria-label="Delete user">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `
            )
            .join("");
        }
      }

      // Setup event listeners
      function setupEventListeners() {
        document
          .getElementById("addUserBtn")
          .addEventListener("click", openAddUserModal);
        document
          .getElementById("closeModal")
          .addEventListener("click", closeUserModal);
        document
          .getElementById("cancelBtn")
          .addEventListener("click", closeUserModal);
        document
          .getElementById("saveUserBtn")
          .addEventListener("click", saveUser);
        document
          .getElementById("backToListBtn")
          .addEventListener("click", backToList);

        // Tab switching
        document.querySelectorAll(".tab").forEach((tab) => {
          tab.addEventListener("click", () => switchTab(tab.dataset.tab));
        });

        // Close modal on overlay click
        document.getElementById("userModal").addEventListener("click", (e) => {
          if (e.target.id === "userModal") {
            closeUserModal();
          }
        });
      }

      // Open add user modal
      function openAddUserModal() {
        document.getElementById("modalTitle").textContent = "Add User";
        document.getElementById("saveUserBtn").textContent = "Add";
        document.getElementById("userForm").reset();
        document.getElementById("modalError").classList.remove("show");
        currentUserId = null;
        isEditing = false;
        document.getElementById("userModal").classList.add("active");
      }

      // Close user modal
      function closeUserModal() {
        document.getElementById("userModal").classList.remove("active");
        document.getElementById("userForm").reset();
        currentUserId = null;
        isEditing = false;
      }

      // Save user
      function saveUser(e) {
        e.preventDefault();

        const name = document.getElementById("userName").value.trim();
        const email = document.getElementById("userEmail").value.trim();
        const contact = document.getElementById("userContact").value.trim();

        // Validation
        if (!name || !email || !contact) {
          showModalError("Please fill in all required fields.");
          return;
        }

        if (!isValidEmail(email)) {
          showModalError("Please enter a valid email address.");
          return;
        }

        if (!isValidPhone(contact)) {
          showModalError("Please enter a valid contact number.");
          return;
        }

        // Check for duplicate email
        const existingUser = users.find(
          (u) => u.email === email && u.id !== currentUserId
        );
        if (existingUser) {
          showModalError("A user with this email already exists.");
          return;
        }

        if (isEditing && currentUserId) {
          // Update existing user
          const userIndex = users.findIndex((u) => u.id === currentUserId);
          if (userIndex !== -1) {
            users[userIndex] = {
              ...users[userIndex],
              name,
              email,
              contact,
              firstName: name.split(" ")[0],
              lastName: name.split(" ").slice(1).join(" "),
            };
          }
        } else {
          // Add new user
          const newUser = {
            id: Date.now(),
            name,
            email,
            contact,
            firstName: name.split(" ")[0],
            lastName: name.split(" ").slice(1).join(" "),
          };
          users.push(newUser);
        }

        saveUsers();
        closeUserModal();
      }

      // Show modal error
      function showModalError(message) {
        const errorEl = document.getElementById("modalError");
        errorEl.textContent = message;
        errorEl.classList.add("show");
        setTimeout(() => {
          errorEl.classList.remove("show");
        }, 5000);
      }

      // Validation helpers
      function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      }

      function isValidPhone(phone) {
        return /^[\d\s\+\-\(\)]+$/.test(phone);
      }

      // View user
      function viewUser(userId) {
        currentUserId = userId;
        const user = users.find((u) => u.id === userId);

        if (!user) return;

        // Show detail view
        document.getElementById("usersListView").style.display = "none";
        document.getElementById("userDetailView").classList.add("active");

        // Populate header
        document.getElementById("detailUserName").textContent = user.name;
        document.getElementById("detailUserEmail").textContent = user.email;
        document.getElementById("detailUserContact").textContent = user.contact;

        // Populate basic info
        document.getElementById("firstName").value = user.firstName || "";
        document.getElementById("lastName").value = user.lastName || "";
        document.getElementById("yearOfBirth").value = user.yearOfBirth || "";
        document.getElementById("gender").value = user.gender || "";
        document.getElementById("phoneNumber").value = user.phoneNumber || "";
        document.getElementById("altPhoneNumber").value =
          user.altPhoneNumber || "";
        document.getElementById("emailId").value = user.emailId || user.email;
        document.getElementById("address").value = user.address || "";
        document.getElementById("pincode").value = user.pincode || "";
        document.getElementById("domicileState").value =
          user.domicileState || "";
        document.getElementById("domicileCountry").value =
          user.domicileCountry || "";

        // Populate education
        document.getElementById("schoolCollege").value =
          user.schoolCollege || "";
        document.getElementById("degree").value = user.degree || "";
        document.getElementById("course").value = user.course || "";
        document.getElementById("completionYear").value =
          user.completionYear || "";
        document.getElementById("grade").value = user.grade || "";
        document.getElementById("skills").value = user.skills || "";
        document.getElementById("projects").value = user.projects || "";

        // Populate experience
        document.getElementById("domain1").value = user.domain1 || "";
        document.getElementById("subdomain1").value = user.subdomain1 || "";
        document.getElementById("experience1").value = user.experience1 || "";
        document.getElementById("linkedinUrl").value = user.linkedinUrl || "";
        document.getElementById("resumeFileName").textContent =
          user.resumeFile || "No file selected";

        // Switch to first tab
        switchTab("basicInfo");
      }

      // Delete user
      function deleteUser(userId) {
        if (confirm("Are you sure you want to delete this user?")) {
          users = users.filter((u) => u.id !== userId);
          saveUsers();
        }
      }

      // Back to list
      function backToList() {
        document.getElementById("userDetailView").classList.remove("active");
        document.getElementById("usersListView").style.display = "block";
        currentUserId = null;
      }

      // Switch tab
      function switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll(".tab").forEach((tab) => {
          tab.classList.remove("active");
        });
        document
          .querySelector(`[data-tab="${tabName}"]`)
          .classList.add("active");

        // Update tab content
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active");
        });
        document.getElementById(`${tabName}Tab`).classList.add("active");
      }

      // Edit functions
      function editBasicInfo() {
        toggleFormFields("basicInfoForm", true);
      }

      function editEducation() {
        toggleFormFields("educationForm", true);
      }

      function editSkills() {
        toggleFormFields("skillsForm", true);
      }

      function editExperience() {
        toggleFormFields("experienceForm", true);
      }

      function editLinkedIn() {
        toggleFormFields("linkedinForm", true);
      }

      function editResume() {
        document.getElementById("resumeFile").disabled = false;
      }

      function toggleFormFields(formId, enable) {
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll("input, select, textarea");
        inputs.forEach((input) => {
          input.disabled = !enable;
        });

        if (enable) {
          // Add save button
          if (!form.querySelector(".save-changes-btn")) {
            const saveBtn = document.createElement("button");
            saveBtn.type = "button";
            saveBtn.className = "btn btn-primary save-changes-btn";
            saveBtn.textContent = "Save Changes";
            saveBtn.style.marginTop = "16px";
            saveBtn.onclick = () => saveFormChanges(formId);
            form.appendChild(saveBtn);
          }
        }
      }

      function saveFormChanges(formId) {
        const user = users.find((u) => u.id === currentUserId);
        if (!user) return;

        // Collect form data based on form type
        if (formId === "basicInfoForm") {
          user.firstName = document.getElementById("firstName").value;
          user.lastName = document.getElementById("lastName").value;
          user.name = `${user.firstName} ${user.lastName}`;
          user.yearOfBirth = document.getElementById("yearOfBirth").value;
          user.gender = document.getElementById("gender").value;
          user.phoneNumber = document.getElementById("phoneNumber").value;
          user.altPhoneNumber = document.getElementById("altPhoneNumber").value;
          user.emailId = document.getElementById("emailId").value;
          user.address = document.getElementById("address").value;
          user.pincode = document.getElementById("pincode").value;
          user.domicileState = document.getElementById("domicileState").value;
          user.domicileCountry =
            document.getElementById("domicileCountry").value;
        } else if (formId === "educationForm") {
          user.schoolCollege = document.getElementById("schoolCollege").value;
          user.degree = document.getElementById("degree").value;
          user.course = document.getElementById("course").value;
          user.completionYear = document.getElementById("completionYear").value;
          user.grade = document.getElementById("grade").value;
        } else if (formId === "skillsForm") {
          user.skills = document.getElementById("skills").value;
          user.projects = document.getElementById("projects").value;
        } else if (formId === "experienceForm") {
          user.domain1 = document.getElementById("domain1").value;
          user.subdomain1 = document.getElementById("subdomain1").value;
          user.experience1 = document.getElementById("experience1").value;
        } else if (formId === "linkedinForm") {
          user.linkedinUrl = document.getElementById("linkedinUrl").value;
        }

        saveUsers();
        toggleFormFields(formId, false);

        // Remove save button
        const form = document.getElementById(formId);
        const saveBtn = form.querySelector(".save-changes-btn");
        if (saveBtn) saveBtn.remove();

        alert("Changes saved successfully!");
      }

      // Utility functions
      function populateYearDropdowns() {
        const currentYear = new Date().getFullYear();
        const yearSelects = [
          document.getElementById("yearOfBirth"),
          document.getElementById("completionYear"),
        ];

        yearSelects.forEach((select) => {
          for (let year = currentYear; year >= currentYear - 100; year--) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            select.appendChild(option);
          }
        });
      }

      function populateStateCountryDropdowns() {
        const states = [
          "Andhra Pradesh",
          "Karnataka",
          "Tamil Nadu",
          "Telangana",
          "Maharashtra",
          "Delhi",
        ];
        const countries = [
          "India",
          "United States",
          "United Kingdom",
          "Canada",
          "Australia",
        ];

        const stateSelect = document.getElementById("domicileState");
        states.forEach((state) => {
          const option = document.createElement("option");
          option.value = state.toLowerCase().replace(/\s+/g, "-");
          option.textContent = state;
          stateSelect.appendChild(option);
        });

        const countrySelect = document.getElementById("domicileCountry");
        countries.forEach((country) => {
          const option = document.createElement("option");
          option.value = country.toLowerCase().replace(/\s+/g, "-");
          option.textContent = country;
          countrySelect.appendChild(option);
        });
      }

      function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
          alert("Copied to clipboard!");
        });
      }

      function viewResume() {
        alert("Resume viewing functionality - would open PDF in new tab");
      }

      // Initialize on load
      document.addEventListener("DOMContentLoaded", init);