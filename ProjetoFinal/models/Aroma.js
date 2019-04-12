//criando a variável de conexão com banco
const mongoose = require ("mongoose")
const Schema = mongoose.Schema;

// definindo os campos que terá na Página: Aroma 

const Aroma = new Schema({
  nome:{
    type:String,
    required: true
  }
})

//criar uma collections (tabela) no mongo, chamada: Aromas
mongoose.model("aromas", Aroma)
