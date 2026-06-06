document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.sidebar-link');
  const sections = document.querySelectorAll('.spa-section');

  function switchTab(targetId) {
    // Remove active class from all links and sections
    navLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    // Find new active link and section
    const newLink = document.querySelector(`.sidebar-link[data-target="${targetId}"]`);
    const newSection = document.getElementById(targetId);

    if (newLink) newLink.classList.add('active');
    if (newSection) newSection.classList.add('active');
  }

  // Add click listeners
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      switchTab(targetId);
    });
  });
});
