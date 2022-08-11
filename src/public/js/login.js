const loader = document.querySelector('.loader');
const main = document.querySelector('.main');

function init() {
  setTimeout(() => {
    loader.style.opacity = 0;
    loader.style.display = 'none';

    main.style.display = 'block';
    setTimeout(() => main.style.opacity = 1, 50);
  }, 3000);
}

init();

const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');

togglePassword.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});

var tokenEncrypt

const form = document.getElementById("loginForm");
form.addEventListener("submit", login);

async function login(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username == "admin") {
    const result = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }).then((res) => res.json());
    if (result.status === "ok") {
      window.location.replace("/portal_admin");
    } else {
      Swal.fire({
        icon: "error",
        title: result.error,
      });
    }
  } else if (username.substring(0, 4) == "stud") {
    const result = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }).then((res) => res.json());
    if (result.status === "ok") {
      const resu = result.data;
      const paid = result.paid;
      console.log(paid)
      if(paid == "true"){
        if (result.lang == "pap") {
          sessionStorage.setItem("token_pap", JSON.stringify(resu));
          window.location.replace("/student_home_pap");
          getStudentInfo();
        } else if (result.lang == "neth") {
          sessionStorage.setItem("token_neth", JSON.stringify(resu));
          window.location.replace("/student_home_neth");
        }
      }else {
        Swal.fire({
          icon: 'warning',
          title: "Please do payment, contact administrator for more information!",
        });
      }
    } else (
      Swal.fire({
        icon: "error",
        title: result.error,
      })
    )
  } else {
    Swal.fire({
      icon: "error",
      title: "Username does not exist!",
    });
  }
}
