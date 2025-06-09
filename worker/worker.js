 const toggleBtn = document.getElementById("toggleMenu");
  const sidebar = document.getElementById("sidebarMenu");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("d-none");
  });

  function handleResize() {
    if (window.innerWidth >= 768) {
      sidebar.classList.remove("d-none");
    } else {
      sidebar.classList.add("d-none");
    }
  }

  handleResize();
  window.addEventListener("resize", handleResize);