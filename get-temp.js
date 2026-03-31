import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";
import { database } from "./firebaseConfig.js";

export function getTemperaturasRealtime(callback) {
  const temperaturasRef = ref(database, "temperaturas");

  onValue(temperaturasRef, (snapshot) => {
    if (!snapshot.exists()) {
      console.warn("Nenhum dado encontrado no Firebase");
      callback([]);
      return;
    }

    const dados = [];

    snapshot.forEach(child => {
      const valor = child.val();

      // validação (evita quebrar gráfico)
      if (valor && valor.valor !== undefined && valor.data) {
        dados.push(valor);
      }
    });x  

    callback(dados);
  }, (erro) => {
    console.error("Erro ao ler Firebase:", erro);
  });
}