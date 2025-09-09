// ================= MAPA =================
function toggleMapa() {
  const mapa = document.getElementById("meuMapa");
  const botao = document.getElementById("botaoMapa");
  if (mapa.style.display === "block") {
    mapa.style.display = "none";
    botao.innerText = "Localização";
  } else {
    mapa.style.display = "block";
    botao.innerText = "Ocultar Localização";
  }
}

// ================= CARROSSEL =================
const captions = [
  "A profissional e as técnicas...",
  "design com henna...",
  "clássico fio a fio...",
  "volume brasileiro...",
  "volume 5D...",
  "design personalizado...",
  "brow lamination...",
  "lash lifting...",
  "e o design masculino."
];

const carouselCaption = document.getElementById("carouselCaption");
const carousel = document.querySelector('.carousel-images');
const dots = document.querySelectorAll('.carousel-dots span');
const slides = document.querySelectorAll('.carousel-images img');
const prevButton = document.querySelector('.arrow-left');
const nextButton = document.querySelector('.arrow-right');

let slideWidth = carousel.clientWidth;
window.addEventListener('resize', () => slideWidth = carousel.clientWidth);

function updateCaption(index) {
  if (captions[index]) {
    carouselCaption.textContent = captions[index];
  }
}

function updateDots(index) {
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[index]) dots[index].classList.add('active');
}

function goToSlide(index) {
  carousel.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
  updateDots(index);
  updateCaption(index);
}

function getCurrentIndex() {
  return Math.round(carousel.scrollLeft / slideWidth);
}

dots.forEach((dot, idx) => dot.addEventListener('click', () => goToSlide(idx)));
prevButton.addEventListener('click', () => goToSlide(Math.max(getCurrentIndex() - 1, 0)));
nextButton.addEventListener('click', () => goToSlide(Math.min(getCurrentIndex() + 1, slides.length - 1)));

let isScrolling;
carousel.addEventListener('scroll', () => {
  clearTimeout(isScrolling);
  isScrolling = setTimeout(() => {
    const index = getCurrentIndex();
    updateDots(index);
    updateCaption(index);
  }, 100);
});

updateCaption(0);

// ================= MODAL =================
function abrirModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = "block";
  setTimeout(() => modal.classList.add("show"), 10);
}

function fecharModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("show");
  setTimeout(() => modal.style.display = "none", 300);
}

window.onclick = function(event) {
  const modals = document.getElementsByClassName('modal');
  for (let m of modals) {
    if (event.target === m) fecharModal(m.id);
  }
};

// ================= AGENDAMENTO =================
const dataInput = document.getElementById("dataAgendamento");
const hoje = new Date().toISOString().split("T")[0];
dataInput.min = hoje;

const horariosDiv = document.getElementById("horariosDisponiveis");
let horaSelecionada = "";

function gerarHorarios(diaSemana) {
  let horarios = [];
  if (diaSemana >= 1 && diaSemana <= 5) {
    for (let h = 9; h < 12; h++) {
      horarios.push(`${h.toString().padStart(2,"0")}:00`, `${h.toString().padStart(2,"0")}:30`);
    }
    for (let h = 13; h < 19; h++) {
      horarios.push(`${h.toString().padStart(2,"0")}:00`, `${h.toString().padStart(2,"0")}:30`);
    }
  } else if (diaSemana === 6) {
    for (let h = 8; h < 17; h++) {
      horarios.push(`${h.toString().padStart(2,"0")}:00`, `${h.toString().padStart(2,"0")}:30`);
    }
  }
  return horarios;
}

dataInput.addEventListener("change", () => {
  const dataSelecionada = new Date(dataInput.value);
  const diaSemana = dataSelecionada.getDay();
  horariosDiv.innerHTML = "";
  horaSelecionada = "";

  if (diaSemana === 0) {
    horariosDiv.style.display = "none";
    alert("Não há atendimento aos domingos. Escolha outra data.");
    dataInput.value = "";
    return;
  }

  gerarHorarios(diaSemana).forEach(h => {
    const btn = document.createElement("button");
    btn.textContent = h;
    btn.type = "button";
    btn.classList.add("horario-btn");
    btn.addEventListener("click", () => {
      document.querySelectorAll(".horario-btn").forEach(b => b.classList.remove("selecionado"));
      btn.classList.add("selecionado");
      horaSelecionada = h;
    });
    horariosDiv.appendChild(btn);
  });

  horariosDiv.style.display = "flex";
});

function enviarAgendamento() {
  const nome = document.getElementById("nomeCliente").value.trim();
  const dataInputValue = dataInput.value;
  const partes = dataInputValue.split("-");
  const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
  const servicosSelecionados = Array.from(document.querySelectorAll('input[name="servicos"]:checked')).map(el => el.value);

  if (!nome || !dataInputValue || !horaSelecionada || servicosSelecionados.length === 0) {
    alert("Por favor, preencha todos os campos antes de enviar.");
    return;
  }

  const mensagem = `Olá Nathália! Gostaria de verificar a disponibilidade de um horário.%0A%0A*Nome:* ${nome}%0A*Serviços:* ${servicosSelecionados.join(", ")}%0A*Data:* ${dataFormatada}%0A*Hora:* ${horaSelecionada}`;
  const url = `https://wa.me/5524998482184?text=${mensagem}`;
  window.open(url);
  fecharModal("modalCliente");
}

function validarServicos() {
  if (document.querySelectorAll('input[name="servicos"]:checked').length === 0) {
    alert("Selecione pelo menos um serviço antes de continuar.");
    return;
  }
  fecharModal("modalServicos");
  abrirModal("modalData");
}

function validarDataHora() {
  if (!dataInput.value) {
    alert("Selecione uma data antes de continuar.");
    return;
  }
  if (!horaSelecionada) {
    alert("Selecione um horário antes de continuar.");
    return;
  }
  fecharModal("modalData");
  abrirModal("modalCliente");
}
