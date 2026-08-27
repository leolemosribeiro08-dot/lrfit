let cart = [];
let total = 0;

function addToCart(id, product, price) {
  const itemExistente = cart.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    cart.push({
      id: id,
      product: product,
      price: price,
      quantidade: 1
    });
  }

  calcularTotal();
  renderCart();
  mostrarMensagemCarrinho();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  calcularTotal();
  renderCart();
}

function calcularTotal() {
  total = 0;

  cart.forEach(item => {
    total += item.price * item.quantidade;
  });
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  list.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${item.product} 
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
  document.getElementById("cart").classList.toggle("open");
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

  const slides = document.querySelector(".slides");
  const images = document.querySelectorAll(".slides a");
  const next = document.querySelector(".next");
  const prev = document.querySelector(".prev");

  let index = 0;          
  let interval;

  function mostrarSlide() {
    slides.style.transform = `translateX(-${index * 100}%)`;
  }

  function proximoSlide() {
    index = (index + 1) % images.length;
    mostrarSlide();
  }

  function slideAnterior() {
    index = (index - 1 + images.length) % images.length;
    mostrarSlide();
  }

  // botões
  next.addEventListener("click", () => {
    proximoSlide();
    resetAutoSlide();
  });

  prev.addEventListener("click", () => {
    slideAnterior();
    resetAutoSlide();
  });

  // autoplay
  function iniciarAutoSlide() {
    interval = setInterval(proximoSlide, 4000);
  }

  function resetAutoSlide() {
    clearInterval(interval);
    iniciarAutoSlide();
  }

  iniciarAutoSlide();