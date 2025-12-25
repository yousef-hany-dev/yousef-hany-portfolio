document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const openDesktop = document.getElementById("openSidebarDesktop");
  const openMobile = document.getElementById("openSidebarMobile");

  if (!sidebar) return;

  let overlay = document.querySelector(".sidebar-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);
  }

  function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.documentElement.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.documentElement.style.overflow = "";
  }

  function toggleSidebar() {
    sidebar.classList.contains("active") ? closeSidebar() : openSidebar();
  }

  openDesktop?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  openMobile?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openSidebar();
  });

  const sidebarCloseBtn = sidebar.querySelector(".close-sidebar");
  sidebarCloseBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeSidebar();
  });

  overlay.addEventListener("click", closeSidebar);

  document.addEventListener("click", (e) => {
    const insideSidebar = sidebar.contains(e.target);
    const insideIcons =
      openDesktop?.contains(e.target) || openMobile?.contains(e.target);
    if (sidebar.classList.contains("active") && !insideSidebar && !insideIcons)
      closeSidebar();
  });
});
