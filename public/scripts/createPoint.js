// popula o select de estados
function populateUfs() {
  const ufSelect = document.querySelector("select[name=uf]");

  // pega os dados de estados da API do IBGE
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
  // converte os dados para json
  .then( res => res.json() )
  .then( states => {

    // insere uma opcao para cada estado
    for (state of states) {
      ufSelect.innerHTML += `<option value=${state.id}>${state.nome}</option>`
    }

  });
}

// popula o select de estados
populateUfs();

// popula o select de cidades com base no id do estado selecionado
function getCities(event) {
  // armazena ambas estruturas do html
  const citySelect = document.querySelector("select[name=city]");
  const stateInput = document.querySelector("input[name=state]");

  // uf value é a id do estado selecionado
  const ufValue = event.target.value;

  // armazena o index do estado selecionado
  const indexOfSelectedState = event.target.selectedIndex;

  // insere o nome do estado no input escondido que sera enviado no form
  stateInput.value = event.target.options[indexOfSelectedState].text;

  // monta a url da api do ibge com a id do estado, ela retorna um json com  todas as cidades que existem dentro de tal estado
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

  //desativa o select de cidade
  citySelect.disabled = true;

  // insere o select padrao "placeholder"
  citySelect.innerHTML = "<option value=''>Selecione a cidade</option>";

  // executa a requisição para a API de IBGE
  fetch(url)
  .then( res => res.json() )
  .then( cities => {
    
    // insere uma opção no select das cidades para cada cidade do json retornado pelo IBGE
    for (city of cities) {
      citySelect.innerHTML += `<option value=${city.nome}>${city.nome}</option>`
    }
    
    // ativa o select
    citySelect.disabled = false;
  });
}

// adiciona um event listener, toda vez que um estado for selecionado ele executara a função getCities
document
.querySelector("select[name=uf]")
.addEventListener("change", getCities);

// itens de coleta
const itemsToCollect = document.querySelectorAll(".itemsGrid li");

// adiciona um event listener para cada item do grid
for (const item of itemsToCollect) {
  item.addEventListener("click", handleSelectedItem);
}

// input escondido que ira retornar os dados pelo form
const collectedItems = document.querySelector("input[name=items]");

// armazena os itens selecionados
let selectedItems = [];

// função que lida com os clicks nos itens
function handleSelectedItem(event) {
  // armazena o item referido (clicado)
  const itemLi = event.target

  // adiciona ou remove a classe selected
  itemLi.classList.toggle("selected");

  // armazena o id do item selecionado
  const itemId = event.target.dataset.id;

  // mapeia o array de itens selecionados e verifica se tal item ja esta selecionado, retorna o index do item se encontrado, se nao retorna -1
  const alreadySelected = selectedItems.findIndex( item => item == itemId );

  // se ja estiver selecionado
  if (alreadySelected != -1) {
    // cria um array momentaneo filtrando o item atual (sem ele)
    const filteredItems = selectedItems.filter( item => item != itemId );
    // insere os dados do array momentaneo no array principal de itens selecionados
    selectedItems = filteredItems;
  }
  // se nao estiver selecionado adiciona o item no array principal
  else {
    selectedItems.push(itemId);
  }
  
  // insere o  array de itens selecionados no input escondido
  collectedItems.value = selectedItems;
}