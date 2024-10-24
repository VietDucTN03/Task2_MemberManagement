let arrayLength = 0;
let currentPage = 1;
let usersPerPage = 10;
let membersData = [];
let filteredData = [];
const url = "https://67176b50b910c6a6e0280cca.mockapi.io/members/";
let isSearchEvent = false;

(newMemberAddBtn = document.querySelector(".addMemberBtn")),
  (darkBg = document.querySelector(".dark_bg")),
  (popupForm = document.querySelector(".popup")),
  (crossBtn = document.querySelector(".closeBtn")),
  (submitBtn = document.querySelector(".submitBtn")),
  (modalTitle = document.querySelector(".modalTitle")),
  (popupFooter = document.querySelector(".popupFooter")),
  (imgInput = document.querySelector(".img")),
  (imgHolder = document.querySelector(".imgholder")),
  (uploadimg = document.querySelector("#uploadimg")),
  (formInputFields = document.querySelectorAll("form input"));
  (inputSearch = document.querySelector("#search"))

/* -------------------------- Lấy API và xử lí trang -------------------------- */
async function totalData() {
  try {
    const res = await fetch(`${url}`, {
      method: "GET",
    });
    const totalData = await res.json();

    membersData = totalData;
    arrayLength = [...membersData];

    updatePagination(usersPerPage);
  } catch (err) {
    console.log(err);
  }
}

async function fetchData(page = 1, limit = 10) {
  try {
    const res = await fetch(`${url}?page=${page}&limit=${limit}`, {
      method: "GET",
    });
    const data = await res.json();

    membersData = data;
    filteredData = [...membersData];

    renderMembers();
    showPagination();
  } catch (err) {
    console.log(err);
  }
}

function renderMembers() {
  let htmlString = "";
  for (let i = 0; i < filteredData.length; i++) {
    let content = filteredData[i];
    htmlString += `
      <tr>
        <td>${content.id}</td>
        <td><img src="${content.Avatar}" alt="Profile Picture" width="40" height="40"></td>
        <td>${content.FirstName} ${content.LastName}</td>
        <td>${content.Age}</td>
        <td>${content.City}</td>
        <td>${content.Position}</td>
        <td>$${content.Salary}</td>
        <td>${new Date(content.StartDate).toLocaleDateString()}</td>
        <td class="hidden-text" onclick="toggleText(this)">${content.Email}</td>
        <td class="hidden-text" onclick="toggleText(this)">${content.Phone}</td>
        <td>
          <button onclick="readMember(${content.id})"><i class="fa-regular fa-eye"></i></button>
          <button onclick="editMember(${content.id})"><i class="fa-regular fa-pen-to-square"></i></button>
          <button onclick="deleteMember(${content.id})"><i class="fa-regular fa-trash-can"></i></button>
        </td>
      </tr>
    `;
  }
  document.querySelector("#userInfo").innerHTML = htmlString;
  showPagination();
}

function showPagination() {
  let length = arrayLength.length;
  const totalEntries = length || filteredData.length;
  const displayedEntries = Math.min(currentPage * usersPerPage, totalEntries);
  const showEntriesHTML = `Showing ${(currentPage - 1) * usersPerPage + 1} to ${displayedEntries} of ${totalEntries} entries`;
  document.querySelector(".showPagination").innerHTML = showEntriesHTML;
}

function updatePagination(usersPerPage) {
  let length;
  let paginationHTML = ""

  if (isSearchEvent) { 
    length = filteredData.length;
  } else {
    length = arrayLength.length;
  }

  const totalPages = Math.ceil(length / usersPerPage);

  paginationHTML += `<button onclick="prevPage()" ${currentPage === 1 ? "disabled" : ""}>Previous</button>`;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button onclick="setPagination(${i})" class="${currentPage === i ? 'active' : ''}">${i}</button>`;
  }

  paginationHTML += `<button onclick="nextPage()" ${currentPage === totalPages ? "disabled" : ""}>Next</button>`;
  document.querySelector(".pagination").innerHTML = paginationHTML;
}

function setPagination(page) {
  currentPage = page;
  fetchData(currentPage, usersPerPage);
  updateActivePage();
}

function nextPage() {
  const totalPages = Math.ceil(arrayLength.length / usersPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    fetchData(currentPage, usersPerPage);
    updateActivePage();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchData(currentPage, usersPerPage);
    updateActivePage();
  }
}

function updateActivePage() {
  const buttons = document.querySelectorAll(".pagination button");
  buttons.forEach((button) => button.classList.remove("active"));
  
  buttons.forEach((button) => {
    if (button.textContent == currentPage) {
      button.classList.add("active");
    }
  });
}

document.getElementById("table_size").addEventListener("change", function () {
  isSearchEvent = false;
  usersPerPage = parseInt(this.value);
  setPagination(1);
  updatePagination(usersPerPage);
});

totalData()

/* -------------------------- Search -------------------------- */
inputSearch.addEventListener("input", () => {
  const searchTerm = inputSearch.value.toLowerCase().trim();

  const newUrl = `${window.location.origin}${window.location.pathname}?search=${searchTerm}`;
  history.pushState({ search: searchTerm }, '', newUrl);

  if (searchTerm !== "") {
    fetch(`${url}?search=${searchTerm}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {

        if (filteredData.length === 0) {
          fetchData(currentPage, usersPerPage);
        } else {
          filteredData = data;
          renderMembers();
          isSearchEvent = true;
          updatePagination(usersPerPage);
        }
      })
      .catch((error) => {
        console.error("Error fetching filtered data:", error);
        renderEmptyState();
      });
  } else {
    fetchData(currentPage, usersPerPage);
  }
});

function renderEmptyState() {
  const membersContainer = document.getElementById("userInfo");
  membersContainer.innerHTML = '<p style="color: #fff">No results found.</p>';
}

/* -------------------------- CRUD -------------------------- */
newMemberAddBtn.addEventListener("click", () => {
  isEdit = false;
  currentEditId = null;
  submitBtn.innerHTML = "Submit";
  modalTitle.innerHTML = "Fill the Form";
  popupFooter.style.display = "block";
  imgInput.src = "./img/pic1.png";
  darkBg.classList.add("active");
  popupForm.classList.add("active");
  formInputFields.forEach((input) => {
    input.value = ""; 
    input.disabled = false;
  });
  submitBtn.style.display = "block";
});

crossBtn.addEventListener("click", () => {
  darkBg.classList.remove("active");
  popupForm.classList.remove("active");
  // form.reset();
});

/* -------------------------- Add Members -------------------------- */
async function addMembers() {
  let avatarUrl = "";

  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;
  const age = parseInt(document.getElementById("age").value, 10);
  const city = document.getElementById("city").value;
  const position = document.getElementById("position").value;
  const salary = document.getElementById("salary").value;
  const startDate = document.getElementById("sDate").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  if (uploadimg.files.length > 0) {
    const fileName = uploadimg.files[0].name;
    // const nameWithoutExt = fileName.split(".").slice(0, -1).join(""); // Remove extension
    avatarUrl = `https://loremflickr.com/640/480/${fileName}`;
  }

  const newMember = {
    FirstName: firstName,
    LastName: lastName,
    Age: age,
    City: city,
    Position: position,
    Salary: salary,
    StartDate: startDate,
    Email: email,
    Phone: phone,
    Avatar: avatarUrl,
  };

  try {
    if (isEdit) {
      // Update the existing member
      const res = await fetch(`${url}${currentEditId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (res.ok) {
        alert("Member updated successfully!");
        darkBg.classList.remove("active");
        popupForm.classList.remove("active");
        fetchData(currentPage, usersPerPage);
      } else {
        throw new Error("Failed to update member");
      }
    } else {
      // Add a new member
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (res.ok) {
        console.log(newMember);
        alert("Member added successfully!");
        darkBg.classList.remove("active");
        popupForm.classList.remove("active");
        fetchData(currentPage, usersPerPage);
      } else {
        throw new Error("Failed to add member");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while processing the member.");
  }
}

// Gán sự kiện cho nút Submit
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  addMembers();
});

uploadimg.onchange = function () {
  if (uploadimg.files[0].size < 1000000) {
    // 1MB = 1000000
    var fileReader = new FileReader();

    fileReader.onload = function (e) {
      var imgUrl = e.target.result;
      imgInput.src = imgUrl;
    };

    fileReader.readAsDataURL(uploadimg.files[0]);
  } else {
    alert("This file is too large!");
  }
};

/* -------------------------- Edit Members -------------------------- */
let isEdit = false;
let currentEditId = null;

async function editMember(id) {
  const memberToEdit = membersData.find((member) => member.id == id);
  if (memberToEdit) {
    isEdit = true;
    currentEditId = id;
    modalTitle.innerHTML = "Edit Member";
    submitBtn.innerHTML = "Update";
    submitBtn.style.display = "block";

    // Populate the form with member data
    document.getElementById("fName").value = memberToEdit.FirstName;
    document.getElementById("lName").value = memberToEdit.LastName;
    document.getElementById("age").value = memberToEdit.Age;
    document.getElementById("city").value = memberToEdit.City;
    document.getElementById("position").value = memberToEdit.Position;
    document.getElementById("salary").value = memberToEdit.Salary;
    document.getElementById("sDate").value = memberToEdit.StartDate;
    document.getElementById("email").value = memberToEdit.Email;
    document.getElementById("phone").value = memberToEdit.Phone;

    // Show the existing avatar
    imgInput.src = memberToEdit.Avatar;

    formInputFields.forEach((input) => {
      input.disabled = false;
    });

    // Display the modal
    darkBg.classList.add("active");
    popupForm.classList.add("active");
  }
}

crossBtn.addEventListener("click", () => {
  darkBg.classList.remove("active");
  popupForm.classList.remove("active");
  isEdit = false;
  currentEditId = null;
  // Reset form fields
  document.getElementById("fName").value = "";
  document.getElementById("lName").value = "";
  document.getElementById("age").value = "";
  document.getElementById("city").value = "";
  document.getElementById("position").value = "";
  document.getElementById("salary").value = "";
  document.getElementById("sDate").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  imgInput.src = "./img/pic1.png"; // Reset image
});

/* -------------------------- Read Members -------------------------- */
async function readMember(id) {
  const memberToRead = membersData.find((member) => member.id == id);
  if (memberToRead) {
    isEdit = true;
    currentEditId = id;
    modalTitle.innerHTML = "Read Member";
    submitBtn.style.display = "none";

    // Populate the form with member data
    document.getElementById("fName").value = memberToRead.FirstName;
    document.getElementById("lName").value = memberToRead.LastName;
    document.getElementById("age").value = memberToRead.Age;
    document.getElementById("city").value = memberToRead.City;
    document.getElementById("position").value = memberToRead.Position;
    document.getElementById("salary").value = memberToRead.Salary;
    document.getElementById("sDate").value = memberToRead.StartDate;
    document.getElementById("email").value = memberToRead.Email;
    document.getElementById("phone").value = memberToRead.Phone;

    // Show the existing avatar
    imgInput.src = memberToRead.Avatar;
    
    formInputFields.forEach((input) => {
      input.disabled = true;
    });

    // Display the modal
    darkBg.classList.add("active");
    popupForm.classList.add("active");
  }
}

crossBtn.addEventListener("click", () => {
  darkBg.classList.remove("active");
  popupForm.classList.remove("active");
  isEdit = false;
  currentEditId = null;
});

/* -------------------------- Delete Members -------------------------- */

async function deleteMember(id) {
  if (confirm("Are you sure you want to delete this member?")) {
    try {
      const res = await fetch(`${url}${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Member deleted successfully!");
        fetchData(currentPage, usersPerPage);
      } else {
        throw new Error("Failed to delete member");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the member.");
    }
  }
}

fetchData();
