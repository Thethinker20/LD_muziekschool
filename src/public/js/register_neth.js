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

$("#ikben").change(function () {
    var selikben = document.getElementById("ikben").value;
    console.log(selikben)
    var stud_p = document.querySelector('.stud_p');

    if (selikben == "Een ouder of voogd") {
        stud_p.style.opacity = 1;
        stud_p.style.display = 'block';
    } else if (selikben == "Een student") {
        stud_p.style.opacity = 0;
        stud_p.style.display = 'none';
    } else if (selikben == "Een volwassen") {
        stud_p.style.opacity = 0;
        stud_p.style.display = 'none';
    }
});

$("#lastname").change(function () {
    var name_u = $('#name').val();
    console.log(name_u);
    var lastname_u = $('#lastname').val();
    console.log(lastname_u);
    var username = $('#username');
    username.val("stud" + name_u.substring(0, 4).toLowerCase() + lastname_u.substring(lastname_u.length-4).toLowerCase() + "326");
});

$("#password").change(function () {
    var password = $("#password").val();
    if (password.length <= 7) {
        $("#CheckPasswordMatch1")
            .html("Het wachtwoord moet meer dan 8 letters bevatten")
            .addClass("text-danger");
    } else {
        $("#CheckPasswordMatch1")
            .html("Het wachtwoord is correct.")
            .removeClass("text-danger")
            .addClass("text-primary");
    }
});

//Confirm password

$("#passwordC").change(function () {
    var password = $("#password").val();
    var confirmPassword = $("#passwordC").val();
    if (password != confirmPassword)
        $("#CheckPasswordMatch")
            .html("Het wachtwoord komt niet overeen!")
            .addClass("text-danger");
    else
        $("#CheckPasswordMatch")
            .html("Wachtwoord match.")
            .removeClass("text-danger")
            .addClass("text-primary");
});

//add cities
$.ajax({
    url: "/json/countries+states+cities.json",
    method: "get",
    success: function (response) {
        $.each(response.country, function (index, value) {
            var country_id;
            var state_id;
            var city_id;

            $("#country").append(
                '<option rel="' +
                index +
                '" value="' +
                value.id +
                '">' +
                value.name +
                "</option>"
            );

            $("#country").change(function () {
                $("#state, #city").find("option:gt(0)").remove();

                country_id = $(this).find("option:selected").attr("rel");

                $.each(response.country[country_id].states, function (index1, value1) {
                    $("#state").find("option:first").text("Selecteer je staat");
                    $("#state").append(
                        '<option rel="' +
                        index1 +
                        '" value="' +
                        value1.id +
                        '">' +
                        value1.name +
                        "</option>"
                    );
                });
            });

            $("#state").change(function () {
                $("#city").find("option:gt(0)").remove();

                state_id = $(this).find("option:selected").attr("rel");

                $.each(
                    response.country[country_id].states[state_id].cities,
                    function (index2, value2) {
                        $("#city").find("option:first").text("Selecteer je stad");
                        $("#city").append(
                            '<option rel="' +
                            index2 +
                            '" value="' +
                            value2.id +
                            '">' +
                            value2.name +
                            "</option>"
                        );
                    }
                );
            });
        });
    },
    error: function (err) {
        alert("server error", err);
    },
});

//netherlans form 
const form = document.getElementById("ld_reg_form_neth");
form.addEventListener("submit", registerUser);

var county1;
var city1;
var state1;

async function registerUser(event) {
  
  const selcou = document.getElementById("country");
  const selsta = document.getElementById("state");
  const selci = document.getElementById("city");
  
  const selvoorkennis = document.getElementById("voorkennis");
  const selbereiken = document.getElementById("bereiken");
  const seltraject = document.getElementById("traject");
  const selnemen = document.getElementById("nemen");
  

  event.preventDefault();

  const lang = "ned";
  const ikben = document.getElementById("ikben").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const passwordC = document.getElementById("passwordC").value;
  const name = document.getElementById("name").value;
  const middlename = document.getElementById("middlename").value;
  const lastname = document.getElementById("lastname").value;
  const address = document.getElementById("address").value;
  const country = selcou.options[selcou.selectedIndex].text; 
  const state = selsta.options[selsta.selectedIndex].text;
  const city = selci.options[selci.selectedIndex].text;

  const voorkennis = selvoorkennis.options[selvoorkennis.selectedIndex].text; 
  const bereiken = selbereiken.options[selbereiken.selectedIndex].text;
  const traject = seltraject.options[seltraject.selectedIndex].text;
  const nemen = selnemen.options[selnemen.selectedIndex].text;

  const email = document.getElementById("email").value;
  const age = document.getElementById("age").value;
  const telefoon = document.getElementById("telefoon").value;

  const result = await fetch("/register_neth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        lang,
        ikben,
      username,
      password,
      passwordC,
      name,
      middlename,
      lastname,
      address,
      country,
      state,
      city,
      email,
      age,
      telefoon,
      voorkennis,
      bereiken,
      traject,
      nemen
    }),
  }).then((res) => res.json());

  if (result.status === "ok") {
    // everythign went fine
    //window.location.replace("/succesful");
    Swal.fire({
        icon: "success",
        title: "Gefeliciteerd, je account is succesvol aangemaakt",
      });
  } else {
    Swal.fire({
        icon: "error",
        title: result.error,
      });
  }
}