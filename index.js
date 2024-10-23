let arrayLength = 0;
let startIndex = 0;
let endIndex = 0;
let maxIndex = 0;
let currentPage = 1;
let usersPerPage = 10;
let membersData = [];
let filteredData = [];

/* -------------------------- Lấy API và xử lí trang -------------------------- */
async function fetchData() {
  try {
    const res = await fetch(
      "https://67176b50b910c6a6e0280cca.mockapi.io/members/",
      {
        method: "GET",
      }
    );
    membersData = await res.json(); // Lưu dữ liệu vào biến toàn cục
    filteredData = [...membersData];

    chiaBang();
    renderMembers();
    showEntries();
  } catch (err) {
    console.log(err);
  }
}

// Hiển thị dữ liệu lên bảng
function renderMembers() {
  let htmlString = "";
  const currentData = filteredData.slice(startIndex, endIndex);

  for (let i = 0; i < currentData.length; i++) {
    let content = currentData[i];
    htmlString += `
      <tr>
        <td>${content.id}</td>
        <td><img src="./img/pic1.png" alt="Profile Picture" width="40" height="40"></td>
        <td>${content.FirstName} ${content.LastName}</td>
        <td>${content.Age}</td>
        <td>${content.City}</td>
        <td>${content.Position}</td>
        <td>$${content.Salary}</td>
        <td>${new Date(content.StartDate).toLocaleDateString()}</td>
        <td class="hidden-text" onclick="toggleText(this)">${content.Email}</td>
        <td class="hidden-text" onclick="toggleText(this)">${content.Phone}</td>
        <td>
          <button><i class="fa-regular fa-eye"></i></button>
          <button><i class="fa-regular fa-pen-to-square"></i></button>
          <button><i class="fa-regular fa-trash-can"></i></button>
        </td>
      </tr>
    `;
  }
  document.querySelector("#userInfo").innerHTML = htmlString;
  updatePagination(); // Cập nhật số trang
  showPagination();
}

// chiaBang
function chiaBang() {
  arrayLength = filteredData.length;
  maxIndex = Math.ceil(arrayLength / usersPerPage);
  setPagination(1);
}

// Thiết lập phân trang
function setPagination(page) {
  currentPage = page;
  startIndex = (currentPage - 1) * usersPerPage;
  endIndex = startIndex + usersPerPage;
  renderMembers();
}

// show entries tren seclection (góc trên trái)
function showEntries() {
  const dropdown = document.getElementById("table_size");
  dropdown.value = usersPerPage; // Đặt giá trị mặc định cho dropdown

  dropdown.addEventListener("change", function () {
    usersPerPage = parseInt(this.value); // Cập nhật số lượng mục mỗi trang
    chiaBang(); 
    setPagination(1); 
  });
}

// Cập nhật nút phân trang (góc dưới phải)
function updatePagination() {
  let paginationHTML = "";

  paginationHTML += `<button onclick="prevPage()" ${currentPage === 1 ? "disabled" : ""}>Previous</button>`;

  for (let i = 1; i <= maxIndex; i++) {
    paginationHTML += `<button onclick="setPagination(${i})" ${currentPage === i ? "class='active'" : ""}>${i}</button>`;
  }

  paginationHTML += `<button onclick="nextPage()" ${currentPage === maxIndex ? "disabled" : ""}>Next</button>`;
  
  document.querySelector(".pagination").innerHTML = paginationHTML;
}

// show thông tin các menber ở trang nào (góc dưới trái)
function showPagination() {
  const totalEntries = filteredData.length;
  const displayedEntries = Math.min(endIndex, totalEntries);
  const showEntriesHTML = `Showing ${startIndex + 1} to ${displayedEntries} of ${totalEntries} entries`;
  
  document.querySelector(".showPagination").innerHTML = showEntriesHTML;
}

function nextPage() {
  if (currentPage < maxIndex) {
    setPagination(currentPage + 1);
  }
}

function prevPage() {
  if (currentPage > 1) {
    setPagination(currentPage - 1);
  }
}

/* -------------------------- Search -------------------------- */
// Tìm kiếm thành viên
function searchMembers() {
  const searchValue = document.getElementById("search").value.toLowerCase(); // Lấy giá trị tìm kiếm
  filteredData = membersData.filter(member => {
    return (
      `${member.FirstName} ${member.LastName}`.toLowerCase().includes(searchValue) ||
      member.City.toLowerCase().includes(searchValue) ||
      member.Position.toLowerCase().includes(searchValue)
    );
  });

  chiaBang();
  renderMembers();
}

document.getElementById("search").addEventListener("input", searchMembers);

/* -------------------------- CRUD -------------------------- */


window.onload = function () {
  fetchData(); // Gọi hàm khởi động
};



