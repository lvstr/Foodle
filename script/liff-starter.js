window.onload = function () {
  const useNodeJS = false; // if you are not using a node server, set this value to false
  const defaultLiffId = "1655528997-5RwvP2mv"; // change the default LIFF value if you are not using a node server

  // DO NOT CHANGE THIS
  let myLiffId = "";

  // if node is used, fetch the environment variable and pass it to the LIFF method
  // otherwise, pass defaultLiffId
  if (useNodeJS) {
    fetch("/send-id")
      .then(function (reqResponse) {
        return reqResponse.json();
      })
      .then(function (jsonResponse) {
        myLiffId = jsonResponse.id;
        initializeLiffOrDie(myLiffId);
      })
      .catch(function (error) {
        document.getElementById("liffAppContent").classList.add("d-none");
        document
          .getElementById("nodeLiffIdErrorMessage")
          .classList.remove("d-none");
      });
  } else {
    myLiffId = defaultLiffId;
    initializeLiffOrDie(myLiffId);
  }
};

/**
 * Check if myLiffId is null. If null do not initiate liff.
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiffOrDie(myLiffId) {
  if (!myLiffId) {
    document.getElementById("liffAppContent").classList.add("d-none");
    document.getElementById("liffIdErrorMessage").classList.remove("d-none");
  } else {
    initializeLiff(myLiffId);
  }
}

/**
 * Initialize LIFF
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiff(myLiffId) {
  liff
    .init({
      liffId: myLiffId,
    })
    .then(() => {
      // start to use LIFF's api
      initializeApp();
    })
    .catch((err) => {
      document.getElementById("liffAppContent").classList.add("d-none");
      document
        .getElementById("liffInitErrorMessage")
        .classList.remove("d-none");
      console.log(err);
    });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
  //displayLiffData();
  displayIsInClientInfo();
  registerButtonHandlers();

  // check if the user is logged in/out, and disable inappropriate button
  if (liff.isLoggedIn()) {
    document.getElementById("liffLoginButton").classList.add("d-none");
    document.getElementById("liffAppContent").classList.remove("d-none");
    document.getElementById("liffInitErrorMessage").classList.add("d-none");
    liff.getProfile().then((profile) => {
     document.getElementById(
          "lineName"
        ).innerHTML = `${profile.displayName}`;
        document.getElementById(
          "lineName2"
        ).innerHTML = `${profile.displayName}`;
      document.getElementById(
        "linePhoto"
      ).innerHTML += `<img class="rounded-circle" src="${profile.pictureUrl}" alt="User Photo Profile" width="20%"/>`;
      console.log(profile);
    });
  } else {
    document.getElementById("liffLogoutButton").classList.add("d-none");
    document.getElementById("liffAppContent").classList.add("d-none");
    document.getElementById("liffInitErrorMessage").classList.remove("d-none");
  }
}

/**
 * Display data generated by invoking LIFF methods
 */
// function displayLiffData() {
//   document.getElementById("isInClient").textContent = liff.isInClient();
//   document.getElementById("isLoggedIn").textContent = liff.isLoggedIn();
// }

/**
 * Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
 */
function displayIsInClientInfo() {
  if (liff.isInClient()) {
    document.getElementById("liffLoginButton").classList.toggle("d-none");
    document.getElementById("liffLogoutButton").classList.toggle("d-none");
    document.getElementById("isInClientMessage").textContent =
      "Kamu membuka Foodle di Aplikasi Line.";
  } else {
    document.getElementById("isInClientMessage").textContent =
      "Kamu membuka Foodle di Browser.";
  }
}

function displayIsInClientInfo() {}

function registerButtonHandlers() {
  document
    .getElementById("openWindowButton")
    .addEventListener("click", function () {
      liff.openWindow({
        url: "https://foodle-angkringan.herokuapp.com/", // Isi dengan Endpoint URL aplikasi web Anda
        external: true,
      });
    });

  document
    .getElementById("closeWindowButton")
    .addEventListener("click", function () {
      if (!liff.isInClient()) {
        sendAlertIfNotInClient();
      } else {
        liff.closeWindow();
      }
    });

  document
    .getElementById("liffLoginButton")
    .addEventListener("click", function () {
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    });

  document
    .getElementById("liffLogoutButton")
    .addEventListener("click", function () {
      if (liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
      }
    });

   document
    .getElementById("sendMessageButton")
    .addEventListener("click", function () {
      if (!liff.isInClient()) {
        sendAlertIfNotInClient();
      } else {
        let cartArray = foodleCart.listCart();
         let output1 = `Hai, ini hasil Order saya:`;
        let hasil = "";
        for (let i in cartArray) {
          hasil += `
- ${cartArray[i].name}: ${cartArray[i].count}x `;
        }
        let output2 = `Total Harga: Rp. ${foodleCart.totalCart()}`;

        liff
          .sendMessages([
            {
              type: "text",
              text: `${output1}

${hasil}

${output2}`,
            },
          ])
          .then(() => {
            window.alert("Orderan Kamu segera diProses ya :)");
          })
          .catch((error) => {
            window.alert("Error sending message: " + error);
          });
      }
    });
}

function sendAlertIfNotInClient() {
  alert(
    "Kamu tidak bisa Menggunakan Fitur ini karena Kamu sedang menggunakan Browser External."
  );
}

/**
 * Toggle specified element
 * @param {string} elementId The ID of the selected element
 */
function toggleElement(elementId) {
  const elem = document.getElementById(elementId);
  if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
    elem.style.display = "none";
  } else {
    elem.style.display = "block";
  }
}
