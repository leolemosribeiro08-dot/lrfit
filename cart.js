let cart = [];
let total = 0;

function addToCart(product, price) {
  cart.push({ product, price });
  total += price;
  renderCart();
}

function removeFromCart(index) {
  total -= cart[index].price;
  cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  list.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.product} - R$${item.price}
      <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>
    `;
    list.appendChild(li);
  });

  totalElement.textContent = total;
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

function finalizarCompra() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "Olá! Quero finalizar minha compra:%0A%0A";

  cart.forEach(item => {
    mensagem += `- ${item.product} | R$ ${item.price}%0A`;
  });

  mensagem += `%0ATotal: R$ ${total}`;

  let numero = "5551920049759"; // COLOQUE SEU NÚMERO AQUI

  window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
}