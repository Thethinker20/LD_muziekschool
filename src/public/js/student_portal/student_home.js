var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};


var tokenStudent;
function getStudentInfo() {
  var tokenEncrypt = sessionStorage.getItem("token_pap");
  var base64Url = tokenEncrypt.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  tokenStudent = JSON.parse(jsonPayload);
  document.getElementById("stud_name").innerText = tokenStudent.name_pap + " "+tokenStudent.lastname_pap;
  //document.getElementById("navbarDropdown").innerText = tokenStudent.name_pap;
  document.getElementById("mi_nivel").innerText = tokenStudent.level;
  document.getElementById("stud_class").innerText = tokenStudent.level;
}
getStudentInfo();


$('#logout_stud').on('click', function(){
  sessionStorage.removeItem("token_pap");
  window.location.replace("/login");
});
