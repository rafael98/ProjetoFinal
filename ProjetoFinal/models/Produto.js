//criando a variável de conexão com banco
const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// definindo os campos que terá na Página: Produto

const Produto = new Schema({
    nome: {
        type: String,
        required: true
    },
    aroma: {
        type: Schema.Types.ObjectId,
        ref:"aromas",
        required: true
    },
    quantidade:  {
        type: Number,
        required:true
    },
    datacompra: {
        type: Date,
        required: true
    }
})

//criar uma collections (tabela) no mongo, chamada: Produtos
mongoose.model ("produtos", Produto)