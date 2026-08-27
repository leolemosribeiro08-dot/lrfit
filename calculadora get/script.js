import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const alunosRef = collection(db, "alunos");
let alunosCache = [];


function calcularGET(sexo, idade, peso, altura, atividade) {
  const tmb = sexo === "homem"
    ? 88.36 + 13.4 * peso + 4.8 * altura - 5.7 * idade
    : 655 + 9.2 * peso + 3.1 * altura - 4.3 * idade;

  return tmb * atividade;
}


function calcularMacros(get, peso) {
  const proteina = peso * 2;
  const gordura = peso * 1;
  const carbo = (get - (proteina * 4 + gordura * 9)) / 4;
  return { proteina, gordura, carbo };
}


window.salvarAluno = async function () {
  try {
    const nome = document.getElementById("nome").value.trim();
    const sexo = document.getElementById("sexo").value;
    const idade = Number(document.getElementById("idade").value);
    const peso = Number(document.getElementById("peso").value);
    const altura = Number(document.getElementById("altura").value);
    const atividade = Number(document.getElementById("atividade").value);

    if (!nome || !idade || !peso || !altura) {
      alert("Preencha tudo");
      return;
    }

    const get = calcularGET(sexo, idade, peso, altura, atividade);
    const macros = calcularMacros(get, peso);

    // 👉 MOSTRA RESULTADO ANTES (importante)
    document.getElementById("resultado").innerHTML = `
      GET: ${get.toFixed(0)} kcal<br>
      Proteína: ${macros.proteina.toFixed(0)} g<br>
      Carbo: ${macros.carbo.toFixed(0)} g<br>
      Gordura: ${macros.gordura.toFixed(0)} g
    `;

    await addDoc(alunosRef, {
      nome, sexo, idade, peso, altura, atividade,
      get,
      ...macros
    });

  } catch (erro) {
    console.error(erro);
    alert("Erro: " + erro.message);
  }
};

async function listarAlunos() {
  const ul = document.getElementById("listaAlunos");
  if (!ul) return;

  alunosCache = [];
  ul.innerHTML = "";

  const snap = await getDocs(alunosRef);

  snap.forEach(d => {
    alunosCache.push({ id: d.id, ...d.data() });
  });

  renderizarLista(alunosCache);
}

function renderizarLista(lista) {
  const ul = document.getElementById("listaAlunos");
  ul.innerHTML = "";

  lista.forEach(a => {
    ul.innerHTML += `
      <li>
        <strong>${a.nome}</strong><br>
        GET: ${a.get.toFixed(0)} kcal<br>
        P: ${a.proteina.toFixed(0)}g |
        C: ${a.carbo.toFixed(0)}g |
        G: ${a.gordura.toFixed(0)}g<br>
        <hr>
      </li>
    `;
  });
}


const campoPesquisa = document.getElementById("pesquisa");
if (campoPesquisa) {
  campoPesquisa.addEventListener("input", () => {
    const termo = campoPesquisa.value.toLowerCase();
    const filtrados = alunosCache.filter(a =>
      a.nome.toLowerCase().includes(termo)
    );
    renderizarLista(filtrados);
  });
}





window.addEventListener("DOMContentLoaded", listarAlunos);
