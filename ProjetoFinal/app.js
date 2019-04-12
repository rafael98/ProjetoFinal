// carregando módulos
const express = require('express')
const handlebars = require ('express-handlebars')
const bodyParser = require ('body-parser')
// recebendo a função que vem do express
const app = express()
const admin = require("./routes/admin")
//recebendo o bootstrap
const path = require ("path")
const mongoose = require ('mongoose')
// carregando os modulos de sessões
const session = require ("express-session")
const flash = require ("connect-flash")


//configurações

    //sessão
      app.use(session({
        secret: "projetonode",
        resave: true,
        saveUninitialized: true
      }))
      app.use (flash())

    //Middleware
    app.use((req, res, next) =>{
      res.locals.success_msg = req.flash("success_msg")
      res.locals.error_msg = req.flash("error_msg")
      next()
    })

   //body-bodyParser
    app.use (bodyParser.urlencoded({extended: true}))
    app.use (bodyParser.json())
  // Handblebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine','handlebars');


  //mongoose
  mongoose.Promise = global.Promise;
  mongoose.connect("mongodb://localhost/ProjetoFinal").then(() =>{
    console.log("Conectado ao Mongo")
  }).catch((err) =>{
    console.log("Erro de conexão com Mongo" +err)
  })


  //public (Arquivos do bootstrap)
    app.use(express.static(path.join(__dirname,"public")))

// rotas
//Home Page
app.get ('/', (req, res) =>{
  res.render("index")
})

    app.use('/admin', admin)

// outros
const PORT = 8083
app.listen(PORT, () => {
  console.log("Servidor rodando!")
})
