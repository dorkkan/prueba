// 🧠 MLR Vanzetti v2.0 — Activación remota vía Sheets (blindado y elegante)

(function () {
  const clienteID = "FW-MLR-ALPHA-27F5"; // ← Controlás desde tu spreadsheet

  // 🔐 Enlace ofuscado (Base64)
  const enlaceCifrado = "aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2UvMlBBQ1gtMXZTR3Z4ZG83S25BS1dXWFZOdXNUWFlnWGZYRS1TVHB4M2swRGRSVHdGbmhmMzFNeVVnWm5lV19vbEJ1YzV2RktsQlZpTG5aOELibVhYQnotcHViP2dpZD0wJnNpbmdsZT10cnVlJm91dHB1dD1jc3Y=
";

  async function iniciarValidacion() {
    try {
      const url = atob(enlaceCifrado);
      const res = await fetch(url);
      const contenido = await res.text();

      const filas = contenido.trim().split("\n").map(f => f.split(","));
      const headers = filas[0];
      const registros = filas.slice(1);

      const idx = headers.reduce((acc, val, i) => (acc[val.trim()] = i, acc), {});
      const fila = registros.find(f => f[idx["clienteID"]] === clienteID);

      if (!fila || fila[idx["activo"]].toLowerCase() !== "true") {
        return bloquear(`Licencia inactiva para ${clienteID}`);
      }

      const fechaVencimiento = new Date(fila[idx["vencimiento"]]);
      if (new Date() > fechaVencimiento) {
        return bloquear(`Licencia vencida el ${fechaVencimiento.toLocaleDateString()}`);
      }

      iniciarSistemaMLR(); // 🔓 Acceso autorizado

    } catch (err) {
      console.error("🌐 Error al validar la licencia:", err);
      bloquear("No se pudo conectar al servidor de licencias.");
    }
  }

  function bloquear(mensaje) {
    document.body.innerHTML = `
      <div style="text-align:center; margin-top:10vh;">
        <h1>🔒 Acceso bloqueado</h1>
        <p>${mensaje}</p>
        <p>Este firmware solo responde al núcleo Vanzetti y a señales autorizadas.</p>
      </div>
    `;
    throw new Error("MLR Firewall: " + mensaje);
  }

  // ☕ Activar el protocolo silencioso al cargar
  iniciarValidacion();
})();
