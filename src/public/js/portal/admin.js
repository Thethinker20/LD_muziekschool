$(document).ready(function () {

    $.ajax({
        url: "/get_students_neth",
        method: "get",
        success: function (response) {
             document.getElementById("num_neth").innerHTML = response["length"];
        },
        error: function (response) {
            alert("server error");
        },
    });

    $.ajax({
        url: "/get_students_pap",
        method: "get",
        success: function (response) {
            document.getElementById("num_cur").innerHTML = response["length"];
        },
        error: function (response) {
            alert("server error");
        },
    });
    setInterval(function(){stud_total()},3000);
});

function stud_total(){
    const stu_total = parseInt(document.getElementById("num_cur").innerHTML) + parseInt(document.getElementById("num_neth").innerHTML);
    console.log(stu_total)
    document.getElementById("studentTotal").innerHTML = stu_total;
}


var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};
