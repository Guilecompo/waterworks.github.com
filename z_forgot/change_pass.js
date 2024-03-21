const change = () => {
    
  
    const password = document.getElementById("password").value;
    const Cpassword = document.getElementById("Cpassword").value;
    
    if (password === '' || Cpassword === '' ) {
      failed_modal();
      return;
    }
    if(password !== Cpassword){
      failed_modal2();
    } else {
        var url = "http://128.199.232.132/waterworks/z_forgot/change_pass.php";
      const formData = new FormData();
      formData.append("password", password);
      formData.append("Email", sessionStorage.getItem("Email"));
  
      axios({
        url: url,
        method: "post",
        data: formData
      }).then(response => {
        var returnValue = response.data;
        if (returnValue === 0 ) {
          failed_modal();
          // alert("Failed to change or Fill password again");
        //   verify1();
        } else {
          // Store user information in sessionStorage
          success_modal();
        }
      }).catch(error => {
        // error_modal();
        failed_modal();
        console.log(error);
      })
    }
  }

  const success_modal = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
    var html = `
        <h5 class="modal-title " style="color: limegreen; text-align:center;">Change Password Successfully</h5>
    `;
    modalContent.innerHTML = html;
    modal.style.display = "block";

    // Function to close modal and redirect
    const closeModalAndRedirect = () => {
        modal.style.display = "none";
        window.location.href = "/waterworks/";
    };

    // Event listener to handle modal closing
    modal.addEventListener('click', () => {
        closeModalAndRedirect();
    });

    // Close modal and redirect after 10 seconds
    setTimeout(closeModalAndRedirect, 10000);
};
const failed_modal = () => {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
var html = `
      <h5 class="modal-title " style="color: red; text-align:center;">Fill in both fields</h5>
  `;
    modalContent.innerHTML = html;
    modal.style.display = "block";

};
  const failed_modal1 = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
  var html = `
        <h5 class="modal-title " style="color: red; text-align:center;">Failed to change </h5>
    `;
      modalContent.innerHTML = html;
      modal.style.display = "block";
  
  };
  const failed_modal2 = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
  var html = `
        <h5 class="modal-title " style="color: red; text-align:center;">Password not match </h5>
    `;
      modalContent.innerHTML = html;
      modal.style.display = "block";
  
  };
  const error_modal = () => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modalContent");
  var html = `
        <h5 class="modal-title " style="color: red; text-align:center;">Unknown error occurred !</h5>
    `;
      modalContent.innerHTML = html;
      modal.style.display = "block";
  
  };
  const closeModal = () => {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    window.location.reload();
    };
  