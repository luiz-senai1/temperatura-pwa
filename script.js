import { database } from "./firebaseConfig.js";
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

// ======= ELEMENTOS =======
const tabela = document.getElementById("tabela");
const tempAtual = document.getElementById("tempAtual");
const tempMedia = document.getElementById("tempMedia");
const tempMax = document.getElementById("tempMax");

const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const statusEl = document.getElementById("status");

// ======= GRÁFICO =======
const ctx = document.getElementById("graficoLinha");
const grafico = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Temperatura (°C)",
      data: [],
      borderColor: "#38bdf8",
      backgroundColor: "rgba(56,189,248,0.2)",
      tension: 0.3,
      fill: true
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { labels: { color: "#e2e8f0" } } },
    scales: { x: { ticks: { color: "#94a3b8" } }, y: { ticks: { color: "#94a3b8" } } }
  }
});

// ======= ENVIO DE TEMPERATURA =======
let intervalo = null;
let temperaturaAtual = 25;

function gerarTemperatura() {
  const variacao = (Math.random() * 2 - 1);
  temperaturaAtual += variacao;
  if (temperaturaAtual < 20) temperaturaAtual = 20;
  if (temperaturaAtual > 35) temperaturaAtual = 35;
  return parseFloat(temperaturaAtual.toFixed(1));
}

function enviarTemperatura() {
  const valor = gerarTemperatura();
  const tempObj = { valor, data: new Date().toISOString() };

  push(ref(database, "temperaturas"), tempObj)
    .then(() => statusEl.innerText = `Enviado: ${valor}°C`)
    .catch(() => statusEl.innerText = "Erro ao enviar ❌");
}

btnStart.addEventListener("click", () => {
  if (!intervalo) {
    enviarTemperatura();
    intervalo = setInterval(enviarTemperatura, 5000);
    statusEl.innerText = "🟢 Envio iniciado";
  }
});

btnStop.addEventListener("click", () => {
  clearInterval(intervalo);
  intervalo = null;
  statusEl.innerText = "⛔ Envio pausado";
});

// ======= DASHBOARD TEMPO REAL =======
function getTemperaturasRealtime(callback) {
  onValue(ref(database, "temperaturas"), snapshot => {
    const dados = [];
    snapshot.forEach(child => {
      const v = child.val();
      if (v && v.valor !== undefined && v.data) dados.push(v);
    });
    callback(dados);
  }, erro => console.error("Erro Firebase:", erro));
}

function formatarHora(dataISO) { return new Date(dataISO).toLocaleTimeString(); }

function atualizarDashboard(dados) {
  if (!dados.length) return;

  dados.sort((a,b)=> new Date(a.data)-new Date(b.data));

  tabela.innerHTML = "";

  const valores = [];
  const labels = [];

  // Tabela últimos 10
  dados.slice(-10).reverse().forEach(d => {
    tabela.innerHTML += `<tr><td>${formatarHora(d.data)}</td><td>${d.valor.toFixed(1)}°C</td></tr>`;
  });

  // Gráfico últimos 20
  dados.slice(-20).forEach(d => { valores.push(d.valor); labels.push(formatarHora(d.data)); });

  grafico.data.labels = labels;
  grafico.data.datasets[0].data = valores;
  grafico.update();

  // Cards
  tempAtual.innerText = valores.at(-1).toFixed(1) + "°C";
  tempMedia.innerText = (valores.reduce((a,b)=>a+b,0)/valores.length).toFixed(1) + "°C";
  tempMax.innerText = Math.max(...valores).toFixed(1) + "°C";
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("PWA pronta 🚀"));
}
// Inicia leitura em tempo real
getTemperaturasRealtime(atualizarDashboard);