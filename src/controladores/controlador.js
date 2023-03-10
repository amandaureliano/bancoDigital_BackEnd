const { format } = require('date-fns');
let { contas, depositos, saques, transferencias } = require('../dados/bancodedados');
let bd = require('./bancodedados');

const idUnico = () => {
    contas = bd.lerBanco('contas');

    let conta = contas.slice(contas.length - 1)[0];
    return conta ? String(Number(conta.numero) + 1) : "1";
}


const consultarContas = (req, res) => {
    contas = bd.lerBanco('contas');
    return res.status(200).json(contas);
}

const criarConta = (req, res) => {
    const usuario = req.body;
    contas = bd.lerBanco('contas');

    const novaConta = {
        numero: idUnico(),
        saldo: 0,
        usuario
    }

    contas.push(novaConta);
    bd.escreverBanco('contas', contas);
    return res.status(201).send();
}

const atualizarConta = (req, res) => {
    const { numeroConta } = req.params;
    const usuario = req.body;
    contas = bd.lerBanco('contas');

    let conta = contas.find((conta) => {
        return conta.numero == numeroConta;
    });

    conta.usuario = usuario;
    bd.escreverBanco('contas', contas);
    return res.status(200).send();
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;
    contas = bd.lerBanco('contas');

    let conta = contas.find((conta) => {
        return conta.numero == numeroConta;
    });

    if (conta.saldo != 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
    }

    let indiceConta = contas.indexOf(conta);
    contas.splice(indiceConta, 1);
    bd.escreverBanco('contas', contas);
    bd.escreverBanco('depositos', contas);
    bd.escreverBanco('saques', contas);
    bd.escreverBanco('transferencias', contas);
    return res.status(204).send();
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    contas = bd.lerBanco('contas');
    depositos = bd.lerBanco('depositos');

    let conta = contas.find((conta) => {
        return conta.numero == numero_conta;
    });

    const transacaoDeposito = {
        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta,
        valor
    }

    depositos.push(transacaoDeposito);
    conta.saldo += valor;
    bd.escreverBanco('contas', contas);
    bd.escreverBanco('depositos', depositos);
    return res.status(204).send();
}

const sacar = (req, res) => {
    const { numero_conta, valor } = req.body;
    contas = bd.lerBanco('contas');
    saques = bd.lerBanco('saques');

    let conta = contas.find((conta) => {
        return conta.numero == numero_conta;
    });

    const transacaoSacar = {
        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta,
        valor
    }

    if (conta.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" });
    }

    saques.push(transacaoSacar);
    conta.saldo -= valor;
    bd.escreverBanco('contas', contas);
    bd.escreverBanco('saques', saques);
    return res.status(204).send();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    contas = bd.lerBanco('contas');
    transferencias = bd.lerBanco('transferencias');

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(401).json({ mensagem: "É obrigatório preencher todos os dados requisitados!" });
    }

    let contaOrigem = contas.find((conta) => {
        return conta.numero == numero_conta_origem;
    });

    let contaDestino = contas.find((conta) => {
        return conta.numero == numero_conta_destino;
    });

    if (!contaOrigem || !contaDestino) {
        return res.status(404).json({ mensagem: "A conta bancária informada não foi encontrada!" });
    }

    if (senha != contaOrigem.usuario.senha) {
        return res.status(403).json({ mensagem: "A senha do banco informada é inválida!" });
    }

    const transacao = {
        data: format(new Date(), "dd-MM-yyyy HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    if (contaOrigem.saldo >= valor) {
        transferencias.push(transacao);
        contaOrigem.saldo -= valor;
        contaDestino.saldo += valor;
    } else {
        return res.status(400).json({ mensagem: "Saldo insuficiente!" });
    }

    bd.escreverBanco('contas', contas);
    bd.escreverBanco('transferencias', transferencias);
    return res.status(204).send();
}

const consultarSaldo = (req, res) => {
    const { numero_conta } = req.query;
    contas = bd.lerBanco('contas');

    let conta = contas.find((conta) => {
        return conta.numero == numero_conta;
    });

    return res.status(200).json(conta.saldo);
}

const consultarExtrato = (req, res) => {
    const { numero_conta } = req.query;
    depositos = bd.lerBanco('depositos');
    saques = bd.lerBanco('saques');
    transferencias = bd.lerBanco('transferencias');

    let depositosFeitos = depositos.filter(deposito => deposito.numero_conta == numero_conta);
    let saquesFeitos = saques.filter(saque => saque.numero_conta == numero_conta);
    let transferenciasEnviadas = transferencias.filter(transferencia => transferencia.numero_conta_origem == numero_conta);
    let transferenciasRecebidas = transferencias.filter(transferencia => transferencia.numero_conta_destino == numero_conta);

    const extrato = {
        depositosFeitos,
        saquesFeitos,
        transferenciasEnviadas,
        transferenciasRecebidas
    }

    return res.status(200).json(extrato);
}

module.exports = {
    consultarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    consultarExtrato
}