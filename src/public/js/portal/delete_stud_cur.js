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
        url: "/get_students_pap",
        method: "get",
        success: function (response) {
            table = $("#edit_cur_table").DataTable({
                responsive: true,
                data: response,
                columns: [
                    { data: "ken" },
                    { data: "name_pap" },
                    { data: "middlename_pap" },
                    { data: "lastname_pap" },
                    { data: "address_pap" },
                    { data: "bario" },
                    { data: "konosementu" },
                    { data: "pastor" },
                    { data: "iglesia" },
                    { data: "email_pap" },
                    { data: "age_pap" },
                ],
                bLengthChange: false,
                bInfo: false,
                bAutoWidth: false,
                order: [[2, "asc"]],
                columnDefs: [
                    { width: '12%', targets: 4 },
                    { width: '10%', targets: 7 }
                ],
            });
        },
        error: function (response) {
            alert("server error");
        },
    });
}
