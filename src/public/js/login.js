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
    }else {
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
      if (result.lang == "pap") {
        localStorage.setItem("token_pap", resu.data);
        window.location.replace("/portal_pap");
      } else if (result.lang == "neth") {
        localStorage.setItem("token_neth", resu.data);
        window.location.replace("/portal_neth");
      } else {
        Swal.fire({
          icon: "error",
          title: result.error,
        });
      }
    }else(
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