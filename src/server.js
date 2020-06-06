const express = require("express");
const server = express();

// criar uma instancia do banco de dados
const db = require("./database/db.js");

// configurar o server para utilizar a pasta publica
server.use(express.static("public"));

// habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }));

// utilizando template engine
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})



//ROTAS

// rota home - main menu
server.get("/", (req, res) => {
  return res.render("index.html", { title: "Ecoleta" });  
})

// rota create point - criar ponto de coleta
server.get("/createPoint", (req, res) => {
  return res.render("createPoint.html");
})

//  rota utilizada pelo form do create point
server.post("/savePoint", (req, res) => {
  // verifica se existem itens selecionados
  if (req.body.items.length === 0) {
    // se nã houverem itens selecionados a seguinte string sera armazenada no local e sera enviada para o banco de dados
    req.body.items = "Nenhum item de coleta cadastrado"
  };

  // template para insert query
  const query = `
    INSERT INTO places (
      name,
      image,
      address,
      address2,
      state,
      city,
      items
    ) VALUES ( ?, ?, ?, ?, ?, ?, ? );
  `;

  // template de valores, utilizando os valores do corpo da requisição enviada pelo form
  const values = [
    req.body.name,
    req.body.img,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items
  ];

  // callback function
  function afterInsertData(err) {
    // error handling
    if (err) {
      return res.send("Erro no cadastro!")
    }

    // retorna para o create point com a propriedade saved, ativando assim o modal
    return res.render("createPoint.html", { saved: true });
  }

  // executa o insert com os values e a callback function
  db.run(query, values, afterInsertData);
})

// search Route
server.get("/search", (req, res) => {
  // armazena a string do form
  const search = req.query.search;
  
  // se a string for vazia (usuario nao digitou nada)
  if (search == "") {
    const error = {
      title: "PESQUISA VAZIA",
      message: "Por favor tente novamente digitando o nome da sua cidade"
    };

    // retorna template de erro, passando o objeto de erro personalizado
    return res.render("error.html", { error });
  }

  // executa uma query
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
    //error handling
    if (err) {
      console.log(err);
    }

    // armazena o total de itens que retornaram da query
    const total = rows.length;

    // se o total for igual a zero
    if (total === 0) {
      const error = {
        title: "NÃO FOI POSSIVEL ENCONTRAR PONTOS DE COLETA",
        message: "Por favor verifique se o nome da cidade foi inserido corretamente, se sim, não há pontos de coleta cadastrados nesta cidade."
      };
      
      // retorna template de erro
      return res.render("error.html", { error });
    }

    // finalmente retorna o search results enviando as propriedades places e total como variaveis, onde places armazena as linhas da query, ou seja cada item
    return res.render("searchResults.html", { places: rows, total: total });
  })

})


// ver todos os pontos
server.get("/allPoints", (req, res) => {
  // executa uma query selecionando todos os itens da table places
  db.all(`SELECT * FROM places`, function(err, rows) {
    // error handling
    if (err) {
      console.log(err);
    }

    // armazena o total de itens retornados
    const total = rows.length;

    // se nao existir nenhum ponto
    if (total === 0) {
      const error = {
        title: "NÃO FOI POSSIVEL ENCONTRAR PONTOS DE COLETA",
        message: "Não há pontos de coleta cadastrados"
      };
      
      // retorna template de erro
      return res.render("error.html", { error });
    }
    
    // finalmente retorna e envia o objeto contendo os pontos e o total de pontos encontrados
    return res.render("searchResults.html", { places:rows, total: total });
  });
}) 

// route autoCollect
server.get("/autoCollect", (req, res) => {
  // apenas renderiza o menu de auto coleta
  return res.render("autoCollect.html");
})

// registrar casa GET
server.get("/registerHome", (req, res) => {
  // renderiza a pagina contendo o formulário
  return res.render("registerHome.html");
})

// registrar casa POST
server.post("/registerHome", (req, res) => {
  // template de inserção no db
  const query = `
      INSERT INTO houses (
        name,
        phone,
        address,
        address2,
        state,
        city
      ) VALUES (?, ?, ?, ?, ?, ?);
  `;

  // template de valores, a partir do corpo da requisição enviada pelo form
  const values = [
    req.body.name,
    req.body.phone,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city
  ];

  // callback function com error handling
  function afterInsertData(err) {
    if (err) {
      return res.send("Erro no cadastro!")
    }

    console.log("Cadastrado com sucesso");
    console.log(this);

    return res.render("registerHome.html", { saved: true });
  }

  // executa a inserção de dados
  db.run(query, values, afterInsertData);
})

//  seja um voluntario mostra todas as casas cadastradas
server.get("/houses", (req, res) => {
  // executa uma query selecionando tudo da table casas
  db.all(`SELECT * FROM houses`, function(err, rows) {
    // error handling
    if (err) {
      console.log(err);
    }

    // armazena o total de itens que retornaram da query
    const total = rows.length;

    // se nao existir nenhuma casa
    if (total === 0) {
      const error = {
        title: "NÃO FOI POSSIVEL ENCONTRAR CASAS",
        message: "Não há nenhuma casa cadastrada."
      };
  
      return res.render("error.html", { error });
    }
    
    // finalmente retorna a template com os itens e o total de itens
    return res.render("houses.html", { places:rows, total: total });
  });
})

// configurar a porta do servidor
server.listen(3000);