const mesAno = document.getElementById('mes-ano');
const dias = document.getElementById('dias').getElementsByTagName('tbody')[0];
const anterior = document.getElementById('anterior');
const proximo = document.getElementById('proximo');
const calendario = document.getElementById('calendario');
const sobreposicao = document.getElementById('sobreposicao');
const fecharSobreposicao = document.querySelector('.fechar-sobreposicao');
const dataAgendamento = document.getElementById('dataAgendamento');

let dataAtual = new Date();
let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();

function mostrarCalendario(mes, ano) {
  const primeiroDia = new Date(ano, mes).getDay();
  const diasNoMes = 32 - new Date(ano, mes, 32).getDate();
  const diasNoMesAnterior = 32 - new Date(ano, mes - 1, 32).getDate();

  mesAno.textContent = `${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(ano, mes))} ${ano}`;
  dias.innerHTML = '';

  let data = 1;
  let linha = document.createElement('tr');
  for (let i = 0; i < 42; i++) {
    if (i < primeiroDia) {
      const diaAnterior = diasNoMesAnterior - primeiroDia + i + 1;
      linha.innerHTML += `<td class="mes-anterior">${diaAnterior}</td>`;
    } else if (data > diasNoMes) {
      const diaPosterior = data - diasNoMes;
      linha.innerHTML += `<td class="mes-posterior">${diaPosterior}</td>`;
      data++;
    } else {
      linha.innerHTML += `<td>${data}</td>`;
      data++;
    }

    if ((i + 1) % 7 === 0) {
      dias.appendChild(linha);
      linha = document.createElement('tr');
    }
  }
}

mostrarCalendario(mesAtual, anoAtual);

anterior.addEventListener('click', () => {
  mesAtual--;
  if (mesAtual < 0) {
    mesAtual = 11;
    anoAtual--;
  }
  mostrarCalendario(mesAtual, anoAtual);
});

proximo.addEventListener('click', () => {
  mesAtual++;
  if (mesAtual > 11) {
    mesAtual = 0;
    anoAtual++;
  }
  mostrarCalendario(mesAtual, anoAtual);
});

calendario.addEventListener('click', (evento) => {

    if (evento.target.tagName === 'TD' && evento.target.textContent !== '') {
        sobreposicao.style.display = 'flex';
    }
    
});

fecharSobreposicao.addEventListener('click', () => {
    sobreposicao.style.display = 'none';
});