// 🎨 MLR Hardware | Control de Tema Visual
// Desarrollado por Elias + Copilot ✨

// 🧠 Carga preferencia previa desde localStorage (si existe)
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("tema") || "oscuro";

  if (savedTheme === "oscuro") {
    document.body.classList.add("dark-mode"); // 🌙 Modo oscuro activado por defecto
  }

  const themeToggle = document.getElementById("toggle-theme");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode"); // 🔄 Cambia entre claro/oscuro

      const temaActual = document.body.classList.contains("dark-mode") ? "oscuro" : "claro";
      localStorage.setItem("tema", temaActual); // 💾 Guarda elección del usuario
    });
  }
});
