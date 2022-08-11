var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};
var country_name;
function Cname() {
    country_name = $(".nav-tabs > li > a").attr("href").replace("#", "");
};
Cname();
$(".nav-tabs > li > a").on('click', function () {
    country_name = $(this).attr("href").replace("#", "");
    console.log(country_name);
});

$('#class_list a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show');
});

// get students by level cur 
$('#bigUCur').on('click', function (e) {
    getLevel();
    async function getLevel(event) {

        const result = await fetch("/acord_method_1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country_name,
            }),
        }).then((res) => res.json());
        table = $("#pap_table").DataTable({
            responsive: true,
            data: result.data,
            columns: [
                { data: "ken" },
                { data: "name_pap" },
                { data: "lastname_pap" },
                { data: "address_pap" },
                { data: "age_pap" },
                { data: "paid" },
                { data: "level" },
            ],
            bLengthChange: false,
            bInfo: false,
            bAutoWidth: false,
            destroy: true,
        });
        document.getElementById('table_name').innerText = "Beginner under 18";
        document.querySelector('.level_tables').style.display = 'block';
    }

});
$('#bigUCur18').on('click', function (e) {
    getLevel();
    async function getLevel(event) {

        const result = await fetch("/acord_method_2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country_name,
            }),
        }).then((res) => res.json());
        table = $("#pap_table").DataTable({
            responsive: true,
            data: result.data,
            columns: [
                { data: "ken" },
                { data: "name_pap" },
                { data: "lastname_pap" },
                { data: "address_pap" },
                { data: "age_pap" },
                { data: "paid" },
                { data: "level" },
            ],
            bLengthChange: false,
            bInfo: false,
            bAutoWidth: false,
            destroy: true,
        });
        document.getElementById('table_name').innerText = "Beginner 18+";
        document.querySelector('.level_tables').style.display = 'block';
    }
});
$('#piano_singers').on('click', function (e) {
    getLevel();
    async function getLevel(event) {

        const result = await fetch("/get_piano_for_singers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country_name,
            }),
        }).then((res) => res.json());
        table = $("#pap_table").DataTable({
            responsive: true,
            data: result.data,
            columns: [
                { data: "ken" },
                { data: "name_pap" },
                { data: "lastname_pap" },
                { data: "address_pap" },
                { data: "age_pap" },
                { data: "paid" },
                { data: "level" },
            ],
            bLengthChange: false,
            bInfo: false,
            bAutoWidth: false,
            destroy: true,
        });
        document.getElementById('table_name').innerText = "Piano for Singers";
        document.querySelector('.level_tables').style.display = 'block';
    }
});
$('#hynmal_skool').on('click', function (e) {
    getLevel();
    async function getLevel(event) {

        const result = await fetch("/get_hymnal_skol", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country_name,
            }),
        }).then((res) => res.json());
        table = $("#pap_table").DataTable({
            responsive: true,
            data: result.data,
            columns: [
                { data: "ken" },
                { data: "name_pap" },
                { data: "lastname_pap" },
                { data: "address_pap" },
                { data: "age_pap" },
                { data: "paid" },
                { data: "level" },
            ],
            bLengthChange: false,
            bInfo: false,
            bAutoWidth: false,
            destroy: true,
        });
        document.getElementById('table_name').innerText = "Hymnal Skool";
        document.querySelector('.level_tables').style.display = 'block';
    }
});
$('#pw_skool').on('click', function (e) {
    getLevel();
    async function getLevel(event) {

        const result = await fetch("/get_pw_skool", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country_name,
            }),
        }).then((res) => res.json());
        table = $("#pap_table").DataTable({
            responsive: true,
            data: result.data,
            columns: [
                { data: "ken" },
                { data: "name_pap" },
                { data: "lastname_pap" },
                { data: "address_pap" },
                { data: "age_pap" },
                { data: "paid" },
                { data: "level" },
            ],
            bLengthChange: false,
            bInfo: false,
            bAutoWidth: false,
            destroy: true,
        });
        document.getElementById('table_name').innerText = "P&W Skool";
        document.querySelector('.level_tables').style.display = 'block';
    }
});

// get students by level neth
$('#bigUNeth').on('click', function (e) {
    getLevel();
    console.log(country_name);
    async function getLevel() {

        const result = await fetch("/acord_method_1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country_name,
            }),
        }).then((res) => res.json());
        table_neth = $("#neth_table").DataTable({
            responsive: true,
            data: result.data,
            columns: [
                { data: "ikben" },
                { data: "name" },
                { data: "lastname" },
                { data: "address" },
                { data: "age" },
                { data: "paid" },
                { data: "level" },
            ],
            destroy: true,
            bLengthChange: false,
            bInfo: false,
            bAutoWidth: false,
        });
        document.getElementById('table_name_neth').innerText = "Beginner under 18";
        document.querySelector('.level_tables_neth').style.display = 'block';
    }

});
$('#bigUCur18_neth').on('click', function (e) {
    getLevel();
    async function getLevel(event) {

        const result = await fetch("/acord_method_2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country_name,
            }),
        }).then((res) => res.json());
        table = $("#neth_table").DataTable({
            responsive: true,
            data: result.data,
            columns: [
                { data: "ikben" },
                { data: "name" },
                { data: "lastname" },
                { data: "address" },
                { data: "age" },
                { data: "paid" },
                { data: "level" },
            ],
            bLengthChange: false,
            bInfo: false,
            bAutoWidth: false,
            destroy: true,
        });
        document.getElementById('table_name_neth').innerText = "Beginner 18+";
        document.querySelector('.level_tables_neth').style.display = 'block';
    }
});
$('#piano_singers_neth').on('click', function (e) {
    getLevel();
    async function getLevel(event) {

        const result = await fetch("/get_piano_for_singers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country_name,
            }),
        }).then((res) => res.json());
        table = $("#neth_table").DataTable({
            responsive: true,
            data: result.data,
            columns: [
                { data: "ikben" },
                { data: "name" },
                { data: "lastname" },
                { data: "address" },
                { data: "age" },
                { data: "paid" },
                { data: "level" },
            ],
            bLengthChange: false,
            bInfo: false,
            bAutoWidth: false,
            destroy: true,
        });
        document.getElementById('table_name_neth').innerText = "Piano for Singers";
        document.querySelector('.level_tables_neth').style.display = 'block';
    }
});
$('#hynmal_skool_neth').on('click', function (e) {
    getLevel();
    async function getLevel(event) {

        const result = await fetch("/get_hymnal_skol", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country_name,
            }),
        }).then((res) => res.json());
        table = $("#neth_table").DataTable({
            responsive: true,
            data: result.data,
            columns: [
                { data: "ikben" },
                { data: "name" },
                { data: "lastname" },
                { data: "address" },
                { data: "age" },
                { data: "paid" },
                { data: "level" },
            ],
            bLengthChange: false,
            bInfo: false,
            bAutoWidth: false,
            destroy: true,
        });
        document.getElementById('table_name_neth').innerText = "Hymnal Skool";
        document.querySelector('.level_tables_neth').style.display = 'block';
        document.querySelector('second_levels').style.display = 'block';
    }
});
$('#pw_skool_neth').on('click', function (e) {
    getLevel();
    async function getLevel(event) {

        const result = await fetch("/get_pw_skool", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                country_name,
            }),
        }).then((res) => res.json());
        table = $("#neth_table").DataTable({
            responsive: true,
            data: result.data,
            columns: [
                { data: "ikben" },
                { data: "name" },
                { data: "lastname" },
                { data: "address" },
                { data: "age" },
                { data: "paid" },
                { data: "level" },
            ],
            bLengthChange: false,
            bInfo: false,
            bAutoWidth: false,
            destroy: true,
        });
        document.getElementById('table_name_neth').innerText = "P&W Skool";
        document.querySelector('.level_tables_neth').style.display = 'block';
    }
});


//change button
$('#change_button_cur').on('click', function () {
        $.ajax({
            url: "/get_students_pap",
            method: "get",
            success: function (response) {
                var len = response.length;
                $("#name_student_cur").empty();
                for (var i = 0; i < len; i++) {
                    var id = response[i]['_id'];
                    var name = response[i]['name_pap'];
    
                    $("#name_student_cur").append("<option value='" + id + "'>" + name + "</option>");
                }
            },
            error: function (response) {
                alert("server error");
            },
        });
});

$('#change_button_neth').on('click', function () {
    $.ajax({
        url: "/get_students_neth",
        method: "get",
        success: function (response) {
            var len = response.length;
            $("#name_student_neth").empty();
            for (var i = 0; i < len; i++) {
                var id = response[i]['_id'];
                var name = response[i]['name'];

                $("#name_student_neth").append("<option value='" + id + "'>" + name + "</option>");
            }
        },
        error: function (response) {
            alert("server error");
        },
    });
});


var level2;
function add2level(){
    const student_level1 = document.getElementById("level_student_cur").value;

    if(student_level1 == "4"){
        document.querySelector('.stl2').style.display = 'block';
    }else if(student_level1 == "5"){
        document.querySelector('.stl2').style.display = 'block';
    }

};

function get2level(){
   level2 =  $( "#level_student_cur2 option:selected" ).text();
}


function add2levelN(){
    const student_level1 = document.getElementById("level_student_neth").value;

    if(student_level1 == "4"){
        document.querySelector('.stl2N').style.display = 'block';
    }else if(student_level1 == "5"){
        document.querySelector('.stl2N').style.display = 'block';
    }

};

function get2levelN(){
   level2 =  $( "#level_student_neth2 option:selected" ).text();
}


var tokenEncrypt

const form = document.getElementById("change_form");
const form_neth = document.getElementById("change_form_neth");
form.addEventListener("submit", changeLevel);
form_neth.addEventListener("submit", changeLevel);

async function changeLevel(event) {
    event.preventDefault();
    var student_id;
    var level;
    if(country_name == "Curacao"){
        student_id = document.getElementById("name_student_cur").value;
        console.log(student_id);
        level = document.getElementById("level_student_cur").value;
    }else{
        student_id = document.getElementById("name_student_neth").value;
        level = document.getElementById("level_student_neth").value;
    }

    const land = country_name;

    if (level == "1") {
        const result = await fetch("/change_level", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                student_id,
                land,
                level:"Accord Method 1",
            }),
        }).then((res) => res.json());
        if (result.status == "202") {
            Swal.fire({
                icon: "success",
                title: result.msg,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: result.msg,
            });
        }
    } else if (level == "2") {
        const result = await fetch("/change_level", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                student_id,
                land,
                level: "Accord Method 2"
            }),
        }).then((res) => res.json());
        if (result.status == "202") {
            Swal.fire({
                icon: "success",
                title: result.msg,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: result.msg,
            });
        }
    } else if (level == "3") {
        const result = await fetch("/change_level", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                student_id,
                land,
                level:"Piano for Singer"
            }),
        }).then((res) => res.json());
        if (result.status == "202") {
            Swal.fire({
                icon: "success",
                title: result.msg,
            })
        } else {
            Swal.fire({
                icon: "error",
                title: result.msg,
            });
        }
    } else if (level == "4") {
        const result = await fetch("/change_level", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                student_id,
                land,
                level:"Hymnal Skool",
                level2: level2
            }),
        }).then((res) => res.json());
        if (result.status == "202") {
            Swal.fire({
                icon: "success",
                title: result.msg,
            })
        } else {
            Swal.fire({
                icon: "error",
                title: result.msg,
            });
        }
    } else if (level == "5") {
        const result = await fetch("/change_level", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                student_id,
                land,
                level:"P&W Skool",
                level2: level2
            }),
        }).then((res) => res.json());
        if (result.status == "202") {
            Swal.fire({
                icon: "success",
                title: result.msg,
            })
        } else {
            Swal.fire({
                icon: "error",
                title: result.msg,
            });
        }
    }
}

//add more input for changes
// $('#multiply_change').on('click',function(){
//     const node = document.getElementById("change_row");
//   const clone = node.cloneNode(true);
//   document.getElementById("change_body").appendChild(clone);
// });