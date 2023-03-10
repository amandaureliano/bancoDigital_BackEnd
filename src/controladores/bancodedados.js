const fs = require('fs');

const bd = {
    lerBanco: (dbNome) => {
        dados = fs.readFileSync(`./src/dados/${dbNome}.json`);
        return JSON.parse(dados);
    },
    escreverBanco: (dbNome, dados) => {
        fs.writeFileSync(`./src/dados/${dbNome}.json`, JSON.stringify(dados));
    }
}

module.exports = bd;