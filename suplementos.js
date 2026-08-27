let quantidade = 1;

function aumentar() {
  quantidade++;
  document.getElementById("qtd").innerText = quantidade;
}

function diminuir() {
  if (quantidade > 1) {
    quantidade--;
    document.getElementById("qtd").innerText = quantidade;
  }
}

let cart = JSON.parse(localStorage.getItem("lrfit_cart")) || [];
let total = 0;

function salvarCarrinho() {
  localStorage.setItem("lrfit_cart", JSON.stringify(cart));
}

function addToCart(id, product, price, qtdAdicionar = 1) {
  id = String(id);
  price = Number(price);
  qtdAdicionar = Number(qtdAdicionar) || 1;

  const itemExistente = cart.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.quantidade += qtdAdicionar;
  } else {
    cart.push({
      id: id,
      product: product,
      price: price,
      quantidade: qtdAdicionar
    });
  }

  salvarCarrinho();
  calcularTotal();
  renderCart();
  mostrarMensagemCarrinho();
}

function removeFromCart(index) {
  cart.splice(index, 1);

  salvarCarrinho();
  calcularTotal();
  renderCart();
}

function calcularTotal() {
  total = 0;

  cart.forEach(item => {
    total += Number(item.price) * Number(item.quantidade);
  });
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  if (!list || !totalElement) return;

  calcularTotal();

  list.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${item.product}</strong>
      <br>
      Quantidade: ${item.quantidade}
      <br>
      R$ ${(item.price * item.quantidade).toFixed(2)}
      <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>
    `;

    list.appendChild(li);
  });

  totalElement.textContent = total.toFixed(2);
}

function toggleCart() {
  const cartElement = document.getElementById("cart");

  if (!cartElement) return;

  cartElement.classList.toggle("open");
  renderCart();
}

async function finalizarCompra() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const itensParaPagamento = cart.map(item => {
    return {
      id: item.id,
      quantidade: item.quantidade
    };
  });

  try {
    const resposta = await fetch("criar_preferencia.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        itens: itensParaPagamento
      })
    });

    const dados = await resposta.json();

    if (dados.link) {
      window.location.href = dados.link;
    } else {
      console.log(dados);
      alert("Erro ao gerar pagamento. Veja o console.");
    }

  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar com o servidor.");
  }
}

function mostrarMensagemCarrinho() {
  const mensagem = document.getElementById("mensagem-carrinho");

  if (!mensagem) return;

  mensagem.classList.add("mostrar");

  setTimeout(() => {
    mensagem.classList.remove("mostrar");
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});