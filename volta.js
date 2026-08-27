const tituloOriginal = document.title;

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    document.title = "Volta aqui 👀";
  } else {
    document.title = tituloOriginal;
  }
});