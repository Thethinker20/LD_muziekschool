$(document).ready(function () {

  
});

$('#modal-container').click(function () {
    $(this).addClass('out');
    $('body').removeClass('modal-active');
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload").change(function () {
    readURL(this);
});

$("#ken").change(function () {
    var selikben = document.getElementById("ken").value;
    var stud_p = document.querySelector('#stud_p_pap');

    if (selikben == "Mayor of voogd") {
        stud_p.style.opacity = 1;
        stud_p.style.display = 'block';
    } else if (selikben == "Studiante") {
        stud_p.style.opacity = 0;
        stud_p.style.display = 'none';
    } else if (selikben == "Mayor di edad") {
        stud_p.style.opacity = 0;
        stud_p.style.display = 'none';
    }
});

$("#lastname_pap").change(function () {
    var name_u = $('#name_pap').val();
    var lastname_u = $('#lastname_pap').val();
    var username = $('#username_pap');
    username.val("stud" + name_u.substring(0, 4).toLowerCase() + lastname_u.substring(lastname_u.length - 4).toLowerCase() + "495");
});

$("#password_pap").change(function () {
    var password = $("#password_pap").val();
    if (password.length <= 7) {
        $("#CheckPasswordMatch1")
            .html("E password mester ta mas ku 8 leter")
            .addClass("text-danger");
    } else {
        $("#CheckPasswordMatch1")
            .html("Password ta korekto.")
            .removeClass("text-danger")
            .addClass("text-primary");
    }
});

//Confirm password
$("#passwordC_pap").change(function () {
    var password = $("#password_pap").val();
    var confirmPassword = $("#passwordC_pap").val();
    if (password != confirmPassword)
        $("#CheckPasswordMatch")
            .html("E password not ta korekto!")
            .addClass("text-danger");
    else
        $("#CheckPasswordMatch")
            .html("Password match.")
            .removeClass("text-danger")
            .addClass("text-primary");
});

//iglesia
$.ajax({
    url: "/json/iglesia.json",
    method: "get",
    success: function (response) {
        $.each(response.iglesia, function (index, value) {

            $("#iglesia").append(
                '<option rel="' +
                index +
                '" value="' +
                value.id +
                '">' +
                value.name +
                "</option>"
            );
        });
    },
    error: function (err) {
        alert("server error", err);
    },
});

//netherlans form 
const form = document.getElementById("ld_reg_form_pap");
form.addEventListener("submit", registerUser);


async function registerUser(event) {

    const selkonosementu = document.getElementById("konosementu");
    const selmeta = document.getElementById("meta");
    const seltrajekto = document.getElementById("trajekto");
    const seliglesia = document.getElementById("iglesia");


    event.preventDefault();
    const lang = "pap";
    const ken = document.getElementById("ken").value;
    const username_pap = document.getElementById("username_pap").value;
    const password_pap = document.getElementById("password_pap").value;
    const passwordC_pap = document.getElementById("passwordC_pap").value;
    const name_pap = document.getElementById("name_pap").value;
    const middlename_pap = document.getElementById("middlename_pap").value;
    const lastname_pap = document.getElementById("lastname_pap").value;
    const address_pap = document.getElementById("address_pap").value;
    const bario = document.getElementById("bario").value;
    const pastor = document.getElementById("pastor").value;

    const konosementu = selkonosementu.options[selkonosementu.selectedIndex].text;
    const meta = selmeta.options[selmeta.selectedIndex].text;
    const trajekto = seltrajekto.options[seltrajekto.selectedIndex].text;
    const iglesia = seliglesia.options[seliglesia.selectedIndex].text;

    const email_pap = document.getElementById("email_pap").value;
    const age_pap = document.getElementById("age_pap").value;
    const telefoon_pap = document.getElementById("telefoon_pap").value;
    const telefoon_emer = document.getElementById("telefoon_emer").value;

    const result = await fetch("/register_pap", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            lang,
            ken,
            username_pap,
            password_pap,
            passwordC_pap,
            name_pap,
            middlename_pap,
            lastname_pap,
            address_pap,
            bario,
            pastor,
            konosementu,
            meta,
            trajekto,
            iglesia,
            email_pap,
            age_pap,
            telefoon_pap,
            telefoon_emer
        }),
    }).then((res) => res.json());
    console.log("success")
    if (result.status == "202") {
        Swal.fire({
            icon: "success",
            title: result.data,
        });
        setTimeout(() => {
            window.location.replace("/login");
        }, 3000);
    } else {
        Swal.fire({
            icon: "error",
            title: result.error,
        });
    }
}