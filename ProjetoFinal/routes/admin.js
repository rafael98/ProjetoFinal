//CONST

const express = require ("express")
const router = express.Router()
// importando e refenciando o mongoose
const mongoose = require("mongoose")

// chamando e carregando o Models/Aroma
require ("../models/Aroma")
// referência do seu Models/aroma para uma variavel ="Aroma"
const Aroma = mongoose.model("aromas")

// chamando e carregando o Models/Produto
require ("../models/Produto")
// referência do seu Models/Produto para uma variavel ="Produto"
const Produto = mongoose.model("produtos")


//----------------------------------------------

// rota: Criação da rota para a página principal do site
router.get ('/',(req, res) =>{
  res.render("admin/index")
})


//----------------------PAGINA : AROMAS-------------------------

  // rota:  Criação da página aromas
  router.get ("/aromas", (req, res) =>{
    //listar os aromas cadastrados no banco de dados
    Aroma.find().then((aromas) => {
      res.render("admin/aromas",{aromas: aromas})
    }).catch((err)=>{
      req.flash("error_msg", "Houve um erro ao listar os aromas")
      res.redirect("/admin")
    })
  })


  // rota: Página aromas/ adicionar novo aroma
  router.get('/aromas/add', (req, res) =>{
    res.render("admin/addaromas")
  })


  // rota: para cadastrar os aromas no banco de dados mongo
  router.post("/aromas/novo",(req, res)=>{

    //validação do formulario aromas
    var erros =[]
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
      erros.push({texto: "Nome inválido"})
    }

      if(erros.length > 0 ){
        res.render("admin/addaromas", {erros:erros})
      }else{
        // SALVANDO OS DADOS DO FORMULÁRIO AROMA, NO BANCO DE DADOS
        // Essa const vai receber um objeto, e vai receber os dados do formulário: Cadastro Aroma
          const novoAroma = {
            nome: req.body.nome
          }

          new Aroma (novoAroma).save().then(() => {
            // mensagem de cadastro com sucesso
            req.flash("success_msg", "Aroma adicionado com sucesso!")
              // se não estiver campos inválidos, após adicionar novo aroma a página será direcionada para a página Inicial: AROMAS
              res.redirect("/admin/aromas")
            }).catch((err) => {
              // mensagem de erro ao cadastrar um novo aroma
              req.flash("error_msg", "Houve um erro durante o salvamento do aroma!")
              res.redirect("/admin/aromas")
            })
            }
            })


  // rota: pagina de editar os aromas cadastrados
  router.get("/aromas/alterar/:id", (req, res) =>{
      //carregar os dados do arroma para editar
      Aroma.findOne({_id:req.params.id}).then((aroma) =>{
        //url da pagina de editar aromas
        res.render("admin/editaromas",{aroma:aroma})
      }).catch ((err)=>{
        req.flash("error_msg", "Este aroma não existe")
        res.redirect("/admin/aromas")
      })
  })

  // rota: validação da alteração/edição dos aromas que foram alterados no formulário de edição Aroma
  router.post("/aromas/alterar",(req, res) =>{
      Aroma.findOne({_id: req.body.id}).then((aroma) =>{
        aroma.nome = req.body.nome
          //validação do salvamento da edição dos aromas que foram alterados no formulário de edição Aroma
          aroma.save().then(() =>{
            req.flash("success_msg", "Aroma editada com sucesso!")
              res.redirect("/admin/aromas")
            }).catch((err) =>{
              req.flash("error_msg", "Houve um erro interno ao salvar a edição do aroma")
              res.redirect("/admin/aromas")
            })

      }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao editar o aroma")
        res.redirect("/admin/aromas")
      })
  })


    // rota: validação da remoção/exclusão dos aromas no banco de dados
    router.get("/aromas/remover/:id", (req, res) =>{
        Aroma.remove({_id: req.params.id}).then(() =>{
          req.flash("success_msg", "Aroma removida com sucesso!")
          res.redirect("/admin/aromas")
        }).catch((err) =>{
          req.flash("error_msg", "Houve um erro ao remover o aroma")
          res.redirect("/admin/aromas")
        })
    })



//----------------------PAGINA : PRODUTOS-------------------------
// rota para a página produtos, listagem

//listar os produtos cadastrados no banco de dados
router.get("/produtos", (req, res) => {
    //listar os produtos cadastrados no banco de dados
    Produto.find().populate("aroma").sort ({data:"desc"}).then((produtos) =>{
      res.render("admin/produtos", {produtos:produtos})
    }).catch((err) =>{
      req.flash("error_msg" , "Houve um erro ao listar os produtos")
      res.redirect("/admin")
    }) 
})

    // rota de cadastramento dos produtos
    router.get("/produtos/add", (req, res) => {

      // Cofiguração para mostrar os arromas cadastrados, no formulário de cadastro dos Produtos
        Aroma.find().then((aromas) => {
          res.render("admin/addprodutos", {aromas: aromas})
        }).catch((err) =>{
          req.flash("error_msg", "Houve um erro ao carregar o formulário")
          res.redirect("/admin")
        })
      })

        // rota: para cadastrar os produtos no banco de dados mongo
          router.post("/produtos/novo", (req, res)=> { 

            //validação de ERRO dos dados dos arromas no formulario de produtos
            var erros = []

              if(req.body.aroma == "0"){
                erros.push({texto: "Aroma inválido, registre um aroma!"})
              }
                // Caso aconteça algum erro, o usuário será direcionado para a página Inicial de Cadastro de Produtos
                if(erros.length > 0){
                  res.render("admin/addprodutos", {erros: erros})
                }else{
                // SALVANDO OS DADOS DO FORMULÁRIO AROMA, NO BANCO DE DADOS
                // Essa const vai receber um objeto, e vai receber os dados do formulário: Cadastro Produto

                  const novoProduto = {
                    nome: req.body.nome,
                    aroma: req.body.aroma,
                    quantidade: req.body.quantidade,
                    datacompra: req.body.datacompra
                  }

                    new Produto (novoProduto).save().then(() =>{
                    // mensagem de cadastro com sucesso
                      req.flash("success_msg", "Produto cadastrado com sucesso!")
                      // se não estiver campos inválidos, após adicionar novo produto a página será direcionada para a página Inicial: PRODUTOS
                      res.redirect("/admin/produtos")
                    }).catch((err) =>{
                      // mensagem de erro ao cadastrar um novo Produto
                      req.flash("erro_msg", "Houve um erro durante o salvamento do produto")
                      res.redirect("/admin/produtos")
                    })
                }
          })


      // rota: pagina de editar os produtos cadastrados
      router.get("/produtos/alterar/:id", (req, res) =>{
        //carregar os dados do produto para editar
        Produto.findOne({_id:req.params.id}).then((produto)=>{

          //carregar os dados os aromas para o formulário de edição
          Aroma.find().then ((aromas)=>{
            res.render("admin/editprodutos", {aromas:aromas, produto:produto})
            //se houver erro, aparecerá a seguinte mensagem:
          }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao listar os arromas")
            res.redirect("/admin/produtos")
          })
            //se houver erro, aparecerá a seguinte mensagem:
        }).catch((err) =>{
          req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
          res.redirect ("/admin/produtos")
        })
      })


      // rota: validação da alteração/edição dos produtos que foram alterados no formulário de edição Produtos
      router.post("/produtos/alterar", (req, res) =>{
      
        Produto.findOne({_id:req.body.id}).then ((produto) =>{
          produto.nome = req.body.nome
          produto.aroma = req.body.aroma
          produto.quantidade = req.body.quantidade
          produto.datacompra = req.body.datacompra
     
            //rota: salvando a edição no banco de dados
            produto.save().then(()=>{
              req.flash("success_msg", "Produto editado com sucesso!")
              res.redirect("/admin/produtos")
            }).catch((err) => {
              req.flash("error_msg", "Houve um erro ")
              res.redirect("/admin/produtos")
            })
        }).catch ((err) =>{
          req.flash("error_msg", "Houve um erro ao salvar a edição")
          res.redirect("/admin/produtos")
        })
      })


        // rota: validação da remoção/exclusão dos produtos no banco de dados
        router.get("/produtos/remover/:id", (req, res) =>{
          Produto.remove({_id: req.params.id}).then(()=>{
            req.flash("success_msg", "Produto deletado com sucesso!")
            res.redirect("/admin/produtos")
          }).catch((err) =>{
            req.flash("error_msg" , "Houve um erro")
            res.redirect("/admin/produtos")
          })
        })

module.exports = router