window.addEventListener("load", (e) => {
  // NAVBAR
  document.querySelector(".nav-burger").addEventListener("click", (e) => {
    const burger = document.querySelector(".nav-burger");
    burger.classList.toggle("change");
    const navStart = document.querySelector(".nav-start");
    const navEnd = document.querySelector(".nav-end");
    const navFlags = document.querySelector(".nav-flags");
    //navStart.classList.toggle("visible");
    navEnd.classList.toggle("visible");
    navFlags.classList.toggle("visible");
  });

  // ACCORDION
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
});

/////////////////////
// SCROLLTO EVENTS //
/////////////////////
document.getElementById("navbar-home").addEventListener("click", (e) => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});
document.getElementById("navbar-menu").addEventListener("click", (e) => {
  document
    .getElementById("menu")
    .scrollIntoView({ behavior: "smooth", block: "center" });
});

document.getElementById("navbar-specials").addEventListener("click", (e) => {
  console.log("HII");
  document
    .getElementById("specials")
    .scrollIntoView({ behavior: "smooth", block: "center" });
});

document.getElementById("navbar-history").addEventListener("click", (e) => {
  document
    .getElementById("history")
    .scrollIntoView({ behavior: "smooth", block: "center" });
});
