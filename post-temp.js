import { database } from "./firebaseConfig.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

let intervalo = null;
let temperaturaAtual = 25;

// Simulação mais realista (variação suave)
function gerarTemperatura() {
  const variacao = (Math.random() * 2 - 1); // -1 a +1
  temperaturaAtual += variacao;

  // Limites
  if (temperaturaAtual < 20) temperaturaAtual = 20;
  if (temperaturaAtual > 35) temperaturaAtual = 35;

  return parseFloat(temperaturaAtual.toFixed(1));
}

function enviarTemperatura() {
  const valor = gerarTemperatura();

  const temperatura = {
    valor,
    data: new Date().toISOString()
  };

  const temperaturasRef = ref(database, "temperaturas");

  push(temperaturasRef, temperatura)
    .then(() => atualizarStatus(`Enviado: ${valor}°C`))
    .catch(() => atualizarStatus("Erro ao enviar ❌"));
}

// UI feedback
function atualizarStatus(msg) {
  const status = document.getElementById("status");
  const log = document.getElementById("log");

  status.innerText = msg;

  const item = document.createElement("li");
  item.textContent = `${new Date().toLocaleTimeString()} → ${msg}`;

  log.prepend(item);
}

// Controle
function iniciar() {
  if (intervalo) return;
  enviarTemperatura();
  intervalo = setInterval(enviarTemperatura, 5000);
  atualizarStatus("🟢 Envio iniciado");
}

function parar() {
  clearInterval(intervalo);
  intervalo = null;
  atualizarStatus("⛔ Envio pausado");
}

// Eventos
document.getElementById("btnStart").addEventListener("click", iniciar);
document.getElementById("btnStop").addEventListener("click", parar);

// Inicia automaticamente (opcional)
iniciar();