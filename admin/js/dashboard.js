let currentPage = 1;
let activities = [];
function onLoad() {
  var accountId = sessionStorage.getItem("accountId");
  if (!accountId || accountId === "0") {
      window.location.href = "/waterworks/";
  } else {
      document.getElementById("ngalan").innerText = sessionStorage.getItem("fullname");
      displayActivity();
      getFileterBranch();
      getall();
  }
}

const getall = () => {
  const total_employees = document.getElementById('totalEmployees');

  const total_consumers = document.getElementById('totalConsumers');
  
  const total_consumed = document.getElementById('totalConsumed');
  
  const total_pay = document.getElementById('totalPay');

  const total_balance = document.getElementById('totalBalance');

  if (!total_consumers || !total_employees || !total_consumed || !total_pay || !total_balance) {
    console.error('One or more required elements not found in the DOM.');

    console.log("Page loaded!");
    return;
  }
  const Url = "http://152.42.243.189/waterworks/admin/total.php";
    axios({
      url: Url,
      method: "post",
  })
  .then(response => response.data)  // Corrected line
  .then(data => {
    console.log('Response data:', data); // Log the response
    if (data && data.Total_Consumers !== undefined 
        && data.Total_Employees !== undefined 
        && data.Total_Consumed !== undefined
        && data.Total_Pay !== undefined
        && data.Total_Balance !== undefined
    ) {
        // Update the DOM with the retrieved data
        const totalPayValue = data.Total_Pay !== null ? data.Total_Pay : 0;
        const totalConsumersValue = data.Total_Consumers !== null ? data.Total_Consumers : 0;
        const totalEmployeesValue = data.Total_Employees !== null ? data.Total_Employees : 0;
        const totalConsumedValue = data.Total_Consumed !== null ? data.Total_Consumed : 0;
        const totalBalanceValue = data.Total_Balance !== null ? data.Total_Balance : 0;

        total_employees.innerText = totalEmployeesValue;

        total_consumers.innerText = totalConsumersValue;

        total_consumed.innerText = totalConsumedValue;

        total_balance.innerText = totalBalanceValue;
        
        total_pay.innerText = totalPayValue;
    } else {
        console.error('Invalid data format or missing properties in the response.');
    }
})

  .catch(error => {
      console.error('Error fetching data:', error);
      console.log(response.data);
  });
}
const getfilter = (selectedBranch) => {
  console.log("selected:", selectedBranch);
  const total_employees = document.getElementById('totalEmployees');

  const total_consumers = document.getElementById('totalConsumers');
  
  const total_consumed = document.getElementById('totalConsumed');
  
  const total_pay = document.getElementById('totalPay');

  const total_balance = document.getElementById('totalBalance');

  if (!total_consumers || !total_employees || !total_consumed || !total_pay || !total_balance) {
    console.error('One or more required elements not found in the DOM.');

    console.log("Page loaded!");
    return;
  }
  const Url = "http://152.42.243.189/waterworks/admin/total_poblacion.php";
  const formData = new FormData();
    formData.append("branchId", selectedBranch);
    axios({
      url: Url,
      method: "post",
      data: formData
  })
  .then(response => response.data)  // Corrected line
  .then(data => {
    console.log(data);
    console.log('Response data:', data); // Log the response
    if (data && data.Total_Consumers !== undefined 
      && data.Total_Employees !== undefined 
      && data.Total_Consumed !== undefined
      && data.Total_Pay !== undefined
      && data.Total_Balance !== undefined
  ) {
      // Update the DOM with the retrieved data
      const totalPayValue = data.Total_Pay !== null ? data.Total_Pay : 0;
      const totalConsumersValue = data.Total_Consumers !== null ? data.Total_Consumers : 0;
      const totalEmployeesValue = data.Total_Employees !== null ? data.Total_Employees : 0;
      const totalConsumedValue = data.Total_Consumed !== null ? data.Total_Consumed : 0;
      const totalBalanceValue = data.Total_Balance !== null ? data.Total_Balance : 0;

      total_employees.innerText = totalEmployeesValue;

      total_consumers.innerText = totalConsumersValue;

      total_consumed.innerText = totalConsumedValue;

      total_balance.innerText = totalBalanceValue;
      
      total_pay.innerText = totalPayValue;
  } else {
      console.error('Invalid data format or missing properties in the response.');
  }
})

  .catch(error => {
      console.error('Error fetching data:', error);
      console.log(error.response.data);
  });
}

// var data = {
//   labels: [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ],
//   datasets: [
//     {
//       label: "New Consumers",
//       borderColor: "rgb(75, 192, 192)",
//       data: [10, 20, 15, 25, 30, 10, 20, 15, 25, 30, 20, 10],
//       fill: false,
//     },
//   ],
// };

// // Chart configuration with responsive settings
// var config = {
//   type: "line",
//   data: data,
//   options: {
//     maintainAspectRatio: false,
//   },
// };

// Get the canvas element
// var ctx = document.getElementById("lineChart").getContext("2d");

// // Create the line chart
// var myChart = new Chart(ctx, config);

const getFileterBranch = () => {
  const branchSelect = document.getElementById("branch");
  var myUrl = "http://152.42.243.189/waterworks/admin/get_branch.php";

  axios({
    url: myUrl,
    method: "post",
  })
    .then((response) => {
      var positions = response.data;

      var options = `<option value="employee">Select Branch</option>`;
      positions.forEach((position) => {
        options += `<option value="${position.branch_name}">${position.branch_name}</option>`;
      });
      branchSelect.innerHTML = options;
      console.log("Selected branch:",branchSelect);

      // Event listener for position change
      branchSelect.addEventListener("change", () => {
        const selectedBranch = branchSelect.value;
        
        // Call the appropriate display function based on the selected position
        if (selectedBranch !== "employee") {
          getfilter(selectedBranch);
        } else {
          getall();
        }
        // Add more conditions as needed for other positions
      });
    })
    .catch((error) => {
      alert(`ERROR OCCURRED! ${error}`);
    });
};

const displayActivity = () => {
  var url = "http://152.42.243.189/waterworks/admin/activitylist.php";
  
  const formData = new FormData();
  formData.append("accountId", sessionStorage.getItem("accountId"));
  
  axios({
    url: url,
    method: "post",
    data: formData
  })
    .then((response) => {
      activities = response.data;
      console.log(activities);
  
      if (!Array.isArray(activities) || activities.length === 0) {
        emptyCards();
      } else {
        showActivityPage(currentPage);
      }
    })
    .catch((error) => {
      alert("ERRORSA! - " + error);
    });  
};

const showNextPage = () => {
  const nextPage = currentPage + 1;
  const start = (nextPage - 1) * 5; // Change 10 to 5
  const end = start + 5; // Change 10 to 5
  const activitiesOnNextPage = activities.slice(start, end);

  if (activitiesOnNextPage.length > 0) {
    currentPage++;
    showActivityPage(currentPage);
  } else {
    alert("Next page is empty or has no content.");
  }
};

const showPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    showActivityPage(currentPage);
  } else {
    alert("You are on the first page.");
  }
};

const showActivityPage = (page, activitiesToDisplay = activities) => {
  var start = (page - 1) * 5; // Change 10 to 5
  var end = start + 5; // Change 10 to 5
  var displayedActivities = activitiesToDisplay.slice(start, end);
  refreshCards(displayedActivities);
  showPaginationNumbers(page, Math.ceil(activitiesToDisplay.length / 5)); // Change 10 to 5
};

const showPaginationNumbers = (currentPage, totalPages) => {
  const paginationNumbersDiv = document.getElementById("paginationNumbers");
  let paginationNumbersHTML = "";

  const pagesToShow = 5; // Number of pages to display

  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }

  paginationNumbersHTML += `<button onclick="showPreviousPage()">Previous</button>`;

  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      paginationNumbersHTML += `<span class="active" onclick="goToPage(${i})">${i}</span>`;
    } else {
      paginationNumbersHTML += `<span onclick="goToPage(${i})">${i}</span>`;
    }
  }

  paginationNumbersHTML += `<button onclick="showNextPage()">Next</button>`;

  paginationNumbersDiv.innerHTML = paginationNumbersHTML;
};

const goToPage = (pageNumber) => {
  showActivityPage(pageNumber);
};

const emptyCards = () => {
  const mainDiv = document.getElementById("mainDivs");
  if (mainDiv) {
    const html = `
      <div class="row">
        <div class="col-12">
          <div class="alert alert-info" role="alert">
            <h5 class="alert-heading">No Data</h5>
            <p>No data available to display at the moment.</p>
          </div>
        </div>
      </div>
    `;
    mainDiv.innerHTML = html;
  } else {
    console.error("Element with id 'mainDivs' not found.");
  }
};

const refreshCards = (activityList) => {
  const mainDiv = document.getElementById("mainDivs");
  if (mainDiv) {
    let html = `<div class="container">`;

    activityList.forEach((activity) => {
      html += `
        <div class="">
          <div class="card shadow border-light">
            <div class="card-body" >
              <p class="card-text">
                ${activity.formatted_date}
                <strong>${activity.firstname} ${activity.lastname}</strong> 
                Successfully ${activity.activity_type} the ${activity.table_name}
              </p>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    mainDiv.innerHTML = html;
  } else {
    console.error("Element with id 'mainDivs' not found.");
  }
};
