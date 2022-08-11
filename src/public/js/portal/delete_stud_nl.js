$(document).ready(function () {
    get_table();
  });
  
    /* To Disable Inspect Element */
    // $(document).bind("contextmenu",function(e) {
    //   e.preventDefault();
    //  });
     
    //  $(document).keydown(function(e){
    //      if(e.which === 123){
    //         return false;
    //      }
    //  });


var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};


function get_table(){
    $.ajax({
        url: "/get_students_neth",
        method: "get",
        success: function (response) {
            table = $("#edit_neth_table").DataTable({
                responsive: true,
                data: response,
                columns: [
                    { data: "username" },
                    { data: "name" },
                    { data: "middlename" },
                    { data: "lastname" },
                    { data: "address" },
                    { data: "state" },
                    { data: "city" },
                    { data: "email" },
                    { data: "age" },
                    { data: "traject" },
                    { data: "nemen" },
                ],
                bLengthChange: false,
                bInfo: false,
                bAutoWidth: false,
                order: [[2, "asc"]],
                columnDefs: [
                    { width: '10%', targets: 0 },
                    { width: '12%', targets: 2 },
                    { width: '12%', targets: 4 },
                    { width: '10%', targets: 6 },
                    { width: '10%', targets: 7 }
                ],
                hover: true,
            });
        },
        error: function (response) {
            alert("server error");
        },
    });
    
}
