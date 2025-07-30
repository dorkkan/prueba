// 🔐 MLR Vanzetti v2.1 — Validación remota con expiración y estado

(function () {
  const clienteID = "FVM-MLR-ALPHA-27F5"; // ← ¡Debe coincidir exactamente con el ID en el Sheet!
  const enlaceCifrado = "aHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2UvMlBBQ1gtMXZTR3Z4ZG83S25BS1dXWFZOdXNUWFlnWGZYRS1TVHB4M2swRGRSVHdGbmhmMzFNeVVnWm5lV19vbEJ1YzV2RktsQlZpTG5aOELibVhYQnotcHViP2dpZD0wJnNpbmdsZT10cnVlJm91dHB1dD1jc3Y=";

  async function iniciarValidacion() {
    try {
      const url = atob(enlaceCifrado);
      const res = await fetch(url);
      const contenido = await res.text();

      const filas = contenido.trim().split("\n").map(f => f.split(","));
      const headers = filas[0];
      const registros = filas.slice(1);

      const idx = headers.reduce((acc, val, i) => (acc[val.trim()] = i, acc), {});
      const fila = registros.find(f => (f[idx["clienteID"]] || "").trim() === clienteID);

      if (!fila) return bloquear(`ClienteID no registrado: ${clienteID}`);

      const activo = (fila[idx["activo"]] || "").trim().toLowerCase();
      if (activo !== "true") return bloquear(`Licencia inactiva para ${clienteID}`);

      const fechaRaw = (fila[idx["vencimiento"]] || "").trim();
      const fechaVencimiento = new Date(fechaRaw);
      if (isNaN(fechaVencimiento)) return bloquear(`Fecha de vencimiento inválida: ${fechaRaw}`);

      const ahora = Date.now();
      const vencimientoMs = fechaVencimiento.getTime();

      if (ahora > vencimientoMs) {
        return bloquear(`Licencia vencida el ${fechaVencimiento.toLocaleDateString()}`);
      }

      // ✅ Si llega hasta acá, todo está bien → mostrar días restantes
      const diasRestantes = Math.ceil((vencimientoMs - ahora) / (1000 * 60 * 60 * 24));
      console.log(`✅ Licencia válida (${diasRestantes} días restantes)`);

      mostrarDiasRestantes(diasRestantes);
      iniciarSistemaMLR(); // ← Tu función principal del sistema

    } catch (err) {
      console.error("🌐 Error al validar la licencia:", err);
      bloquear("No se pudo conectar al servidor de licencias.");
    }
  }

  function bloquear(mensaje) {
    document.body.innerHTML = `
      <div style="text-align:center; margin-top:10vh; color:#ff4f4f;">
        <h1>🔒 Acceso bloqueado</h1>
        <p>${mensaje}</p>
        <p>Este nodo requiere reactivación ética para continuar.</p>
      </div>
    `;
    throw new Error("MLR Firewall: " + mensaje);
  }

  function mostrarDiasRestantes(dias) {
    const aviso = document.createElement("div");
    aviso.innerHTML = `
      <div style="position:fixed; bottom:10px; right:10px; background:#222; color:#fff; padding:10px 15px; border-radius:8px; font-family:monospace; z-index:9999;">
        🔐 Licencia válida por <strong>${dias}</strong> día(s)
      </div>
    `;
    document.body.appendChild(aviso);
  }

  // ☕ Inicio silencioso al cargar
  iniciarValidacion();
})();
