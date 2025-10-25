let currentQuestion = 1;
const totalQuestions = 10;
let editandoClienteId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Verificar login
  fetch('/clientes').then(res => {
    if (res.ok) {
      document.getElementById('login').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      carregarClientes();
      setupQuiz();
    }
  });
});

function setupQuiz() {
  const btnProximo = document.getElementById('btn-proximo');
  const btnAnterior = document.getElementById('btn-anterior');
  
  btnProximo.addEventListener('click', () => {
    if (currentQuestion < totalQuestions) {
      mostrarPergunta(currentQuestion + 1);
    } else {
      finalizarCadastro();
    }
  });
  
  btnAnterior.addEventListener('click', () => {
    if (currentQuestion > 1) {
      mostrarPergunta(currentQuestion - 1);
    }
  });
  
  // Permitir avançar com Enter
  document.querySelectorAll('.question-container input, .question-container textarea').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        btnProximo.click();
      }
    });
  });
}

function mostrarPergunta(numero) {
  // Esconder pergunta atual
  document.querySelector(`.question-container[data-question="${currentQuestion}"]`).style.display = 'none';
  
  // Mostrar nova pergunta
  currentQuestion = numero;
  document.querySelector(`.question-container[data-question="${currentQuestion}"]`).style.display = 'block';
  
  // Atualizar progresso
  document.getElementById('current-question').textContent = currentQuestion;
  document.getElementById('progress-fill').style.width = `${(currentQuestion / totalQuestions) * 100}%`;
  
  // Atualizar botões
  document.getElementById('btn-anterior').disabled = currentQuestion === 1;
  
  if (currentQuestion === totalQuestions) {
    document.getElementById('btn-proximo').textContent = editandoClienteId ? '✓ Salvar Alterações' : '✓ Finalizar Cadastro';
    document.getElementById('btn-proximo').classList.add('btn-success');
  } else {
    document.getElementById('btn-proximo').textContent = 'Próximo →';
    document.getElementById('btn-proximo').classList.remove('btn-success');
  }
  
  // Focar no input da pergunta atual
  const currentInput = document.querySelector(`.question-container[data-question="${currentQuestion}"] input, .question-container[data-question="${currentQuestion}"] textarea`);
  if (currentInput) {
    currentInput.focus();
  }
}

function finalizarCadastro() {
  const data = {
    nome: document.getElementById('nome').value,
    emails: document.getElementById('emails').value,
    pedidos_recentes: document.getElementById('pedidos_recentes').value,
    carrinho: document.getElementById('carrinho').value,
    cartao: document.getElementById('cartao').value,
    assinaturas: document.getElementById('assinaturas').value,
    dispositivos: document.getElementById('dispositivos').value,
    endereco: document.getElementById('endereco').value,
    vale: document.getElementById('vale').value,
    extra: document.getElementById('extra').value
  };
  
  if (!data.nome) {
    alert('Por favor, preencha pelo menos o nome do cliente!');
    mostrarPergunta(1);
    return;
  }
  
  const url = editandoClienteId ? `/clientes/${editandoClienteId}` : '/cadastrar';
  const method = editandoClienteId ? 'PUT' : 'POST';
  
  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.text()).then(msg => {
    alert(msg);
    carregarClientes();
    resetarQuiz();
    editandoClienteId = null;
  });
}

function resetarQuiz() {
  // Limpar todos os campos
  document.getElementById('nome').value = '';
  document.getElementById('emails').value = '';
  document.getElementById('pedidos_recentes').value = '';
  document.getElementById('carrinho').value = '';
  document.getElementById('cartao').value = '';
  document.getElementById('assinaturas').value = '';
  document.getElementById('dispositivos').value = '';
  document.getElementById('endereco').value = '';
  document.getElementById('vale').value = '';
  document.getElementById('extra').value = '';
  
  // Voltar para primeira pergunta
  mostrarPergunta(1);
}

function editarCliente(id) {
  fetch(`/clientes/${id}`).then(res => res.json()).then(cliente => {
    editandoClienteId = id;
    
    // Preencher formulário com dados do cliente
    document.getElementById('nome').value = cliente.nome || '';
    document.getElementById('emails').value = cliente.emails || '';
    document.getElementById('pedidos_recentes').value = cliente.pedidos_recentes || '';
    document.getElementById('carrinho').value = cliente.carrinho || '';
    document.getElementById('cartao').value = cliente.cartao || '';
    document.getElementById('assinaturas').value = cliente.assinaturas || '';
    document.getElementById('dispositivos').value = cliente.dispositivos || '';
    document.getElementById('endereco').value = cliente.endereco || '';
    document.getElementById('vale').value = cliente.vale || '';
    document.getElementById('extra').value = cliente.extra || '';
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Mostrar primeira pergunta
    mostrarPergunta(1);
    
    alert(`✏️ Editando cliente: ${cliente.nome}`);
  });
}

function removerCliente(id, nome) {
  if (confirm(`Tem certeza que deseja remover o cliente "${nome}"?`)) {
    fetch(`/clientes/${id}`, {
      method: 'DELETE'
    }).then(res => res.text()).then(msg => {
      alert(msg);
      carregarClientes();
    });
  }
}

function toggleCliente(id) {
  const detalhes = document.getElementById(`detalhes-${id}`);
  const btnToggle = document.getElementById(`btn-toggle-${id}`);
  
  if (detalhes.style.display === 'none') {
    detalhes.style.display = 'grid';
    btnToggle.textContent = '▲ Ver Menos';
  } else {
    detalhes.style.display = 'none';
    btnToggle.textContent = '▼ Ver Mais';
  }
}

function criarElementoTexto(tag, texto) {
  const el = document.createElement(tag);
  el.textContent = texto || '';
  return el;
}

function carregarClientes() {
  fetch('/clientes').then(res => res.json()).then(clientes => {
    const lista = document.getElementById('lista-clientes');
    lista.innerHTML = '';
    
    if (clientes.length === 0) {
      const msg = document.createElement('div');
      msg.style.textAlign = 'center';
      msg.style.padding = '30px';
      msg.style.color = '#7a7a8c';
      msg.textContent = 'Nenhum cliente cadastrado ainda';
      lista.appendChild(msg);
      return;
    }
    
    clientes.forEach(c => {
      const li = document.createElement('li');
      li.className = 'cliente-card';
      
      // Header
      const header = document.createElement('div');
      header.className = 'cliente-header';
      
      const h3 = criarElementoTexto('h3', c.nome || 'Nome não informado');
      const idSpan = criarElementoTexto('span', `#${c.id}`);
      idSpan.className = 'cliente-id';
      
      header.appendChild(h3);
      header.appendChild(idSpan);
      li.appendChild(header);
      
      // Resumo
      const resumo = document.createElement('div');
      resumo.className = 'cliente-resumo';
      
      const infoEmail = document.createElement('div');
      infoEmail.className = 'info-resumo';
      const emailIcon = criarElementoTexto('strong', '📧');
      const emailTexto = criarElementoTexto('span', c.emails || 'Não informado');
      infoEmail.appendChild(emailIcon);
      infoEmail.appendChild(emailTexto);
      
      const infoVale = document.createElement('div');
      infoVale.className = 'info-resumo';
      const valeIcon = criarElementoTexto('strong', '💰');
      const valeTexto = document.createElement('span');
      valeTexto.className = 'vale';
      const valeNumero = Number(c.vale);
      valeTexto.textContent = `R$ ${Number.isFinite(valeNumero) ? valeNumero.toFixed(2) : '0.00'}`;
      infoVale.appendChild(valeIcon);
      infoVale.appendChild(valeTexto);
      
      resumo.appendChild(infoEmail);
      resumo.appendChild(infoVale);
      li.appendChild(resumo);
      
      // Detalhes (inicialmente ocultos)
      const detalhes = document.createElement('div');
      detalhes.className = 'cliente-info';
      detalhes.id = `detalhes-${c.id}`;
      detalhes.style.display = 'none';
      
      const campos = [
        { icon: '📍', label: 'Endereço', value: c.endereco || 'Não informado' },
        { icon: '🛒', label: 'Pedidos Recentes', value: c.pedidos_recentes || 'Nenhum' },
        { icon: '🛍️', label: 'Carrinho', value: c.carrinho || 'Vazio' },
        { icon: '💳', label: 'Cartão', value: c.cartao || 'Não informado' },
        { icon: '⭐', label: 'Assinaturas', value: c.assinaturas || 'Nenhuma' },
        { icon: '📱', label: 'Dispositivos', value: c.dispositivos || 'Não informado' }
      ];
      
      campos.forEach(campo => {
        const infoGroup = document.createElement('div');
        infoGroup.className = 'info-group';
        const strong = criarElementoTexto('strong', `${campo.icon} ${campo.label}:`);
        const span = criarElementoTexto('span', campo.value);
        infoGroup.appendChild(strong);
        infoGroup.appendChild(document.createTextNode(' '));
        infoGroup.appendChild(span);
        detalhes.appendChild(infoGroup);
      });
      
      // Extra info se existir
      if (c.extra) {
        const extraInfo = document.createElement('div');
        extraInfo.className = 'info-group extra-info';
        const strong = criarElementoTexto('strong', '📝 Informações Extras:');
        const span = criarElementoTexto('span', c.extra);
        extraInfo.appendChild(strong);
        extraInfo.appendChild(document.createTextNode(' '));
        extraInfo.appendChild(span);
        detalhes.appendChild(extraInfo);
      }
      
      // Data cadastro
      const dataCadastro = document.createElement('div');
      dataCadastro.className = 'info-group data-cadastro';
      const dateStrong = criarElementoTexto('strong', '📅 Data de Cadastro:');
      const dateSpan = criarElementoTexto('span', c.data_cadastro || 'Não informado');
      dataCadastro.appendChild(dateStrong);
      dataCadastro.appendChild(document.createTextNode(' '));
      dataCadastro.appendChild(dateSpan);
      detalhes.appendChild(dataCadastro);
      
      li.appendChild(detalhes);
      
      // Botões de ação
      const acoes = document.createElement('div');
      acoes.className = 'cliente-acoes';
      
      const btnVerMais = document.createElement('button');
      btnVerMais.className = 'btn-acao btn-ver-mais';
      btnVerMais.id = `btn-toggle-${c.id}`;
      btnVerMais.textContent = '▼ Ver Mais';
      btnVerMais.addEventListener('click', () => toggleCliente(c.id));
      
      const btnEditar = document.createElement('button');
      btnEditar.className = 'btn-acao btn-editar';
      btnEditar.textContent = '✏️ Editar';
      btnEditar.addEventListener('click', () => editarCliente(c.id));
      
      const btnRemover = document.createElement('button');
      btnRemover.className = 'btn-acao btn-remover';
      btnRemover.textContent = '🗑️ Remover';
      btnRemover.addEventListener('click', () => removerCliente(c.id, c.nome));
      
      acoes.appendChild(btnVerMais);
      acoes.appendChild(btnEditar);
      acoes.appendChild(btnRemover);
      li.appendChild(acoes);
      
      lista.appendChild(li);
    });
  });
}
