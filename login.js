// IMPORTS FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// CONFIG DO TEU FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBOhj3-3eau6BWoBrTS8TTRTvRnJrHuzJI",
  authDomain: "login-1464f.firebaseapp.com",
  projectId: "login-1464f",
  storageBucket: "login-1464f.firebasestorage.app",
  messagingSenderId: "956493280570",
  appId: "1:956493280570:web:973adb549bb3dce724cc03"
};

// INICIAR FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// LOGIN
window.login = async function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    await signInWithEmailAndPassword(auth, email, senha);

    document.getElementById("msg").style.color = "green";
    document.getElementById("msg").innerText = "Login feito com sucesso!";

    setTimeout(() => {
      window.location.href = "inicio.html";
    }, 1000);

  } catch (erro) {
    document.getElementById("msg").style.color = "red";
    document.getElementById("msg").innerText = "Erro: " + erro.message;
  }
};

// CADASTRO
window.cadastrar = async function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    await createUserWithEmailAndPassword(auth, email, senha);

    document.getElementById("msg").style.color = "lightgreen";
    document.getElementById("msg").innerText = "Conta criada! Agora faz login.";

  } catch (erro) {
    document.getElementById("msg").style.color = "red";
    document.getElementById("msg").innerText = "Erro: " + erro.message;
  }
};

