(function () {
  const navbar = document.getElementById("navbar");
  // const span1 = document.getElementById("span1");
  const sd = document.querySelector(".sd"); // ✔ صح

  if (!navbar || !sd) return;

  function onScroll() {
    if (window.scrollY > 50) {
      navbar.style.background = "#2564ebda";
      navbar.style.boxShadow = "0 0 10px 0px #39ff";
      navbar.style.color = "#FFFFFF";

      // span1.style.color = "black";
      sd.style.color = "black";
    } else {
      navbar.style.background = "transparent";
      navbar.style.boxShadow = "none";
      navbar.style.color = "white";

      
      sd.style.color = "#ffffff";
    }
  }

  window.addEventListener("scroll", onScroll);
})();
