const express = require('express');
const { consultarContas, criarConta, atualizarConta, excluirConta, depositar, sacar, transferir, consultarSaldo, consultarExtrato } = require('../controladores/controlador');
const { verificarSenhaBancoQuery, verificarContaUnicaBody, verificarNumeroContaParams, verificarNumeroContaEValorBody, verificarSenhaContaBody, verificarNumeroContaESenhaQuery } = require('../intermediarios');

const roteador = express();

roteador.get('/contas', verificarSenhaBancoQuery, consultarContas);
roteador.post('/contas', verificarContaUnicaBody, criarConta);
roteador.put('/contas/:numeroConta/usuario', verificarContaUnicaBody, verificarNumeroContaParams, atualizarConta);
roteador.delete('/contas/:numeroConta', verificarNumeroContaParams, excluirConta);
roteador.post('/transacoes/depositar', verificarNumeroContaEValorBody, depositar);
roteador.post('/transacoes/sacar', verificarNumeroContaEValorBody, verificarSenhaContaBody, sacar);
roteador.post('/transacoes/transferir', transferir);
roteador.get('/contas/saldo', verificarNumeroContaESenhaQuery, consultarSaldo);
roteador.get('/contas/extrato', verificarNumeroContaESenhaQuery, consultarExtrato);

module.exports = roteador;