let { banco, contas } = require('./dados/bancodedados');
let bd = require('./controladores/bancodedados');

const verificarSenhaBancoQuery = (req, res, next) => {
    const { senha_banco } = req.query;
    contas = bd.lerBanco('contas');

    if (!senha_banco) {
        return res.status(401).json({ mensagem: "É obrigatório informar a senha do banco!" });
    }

    if (senha_banco !== banco.senha) {
        return res.status(403).json({ mensagem: "A senha do banco informada é inválida!" });
    }

    next();
}

const verificarNumeroContaESenhaQuery = (req, res, next) => {
    let { numero_conta, senha } = req.query;
    contas = bd.lerBanco('contas');

    if (!numero_conta || !senha) {
        return res.status(401).json({ mensagem: "É obrigatório preencher todos os dados requisitados!" });
    }

    let conta = contas.find((conta) => {
        return conta.numero == numero_conta;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "A conta bancária não foi encontrada!" });
    }

    if (senha != conta.usuario.senha) {
        return res.status(403).json({ mensagem: "A senha do banco informada é inválida!" });
    }

    next();
}

const verificarNumeroContaParams = (req, res, next) => {
    const { numeroConta } = req.params;
    contas = bd.lerBanco('contas');

    if (!numeroConta) {
        return res.status(401).json({ mensagem: "É obrigatório informar o numero da conta!" });
    }

    let conta = contas.find((conta) => {
        return conta.numero == numeroConta;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "A conta bancária não foi encontrada!" });
    }

    next();
}

const verificarSenhaContaBody = (req, res, next) => {
    const { numero_conta, senha } = req.body;
    contas = bd.lerBanco('contas');

    if (!senha) {
        return res.status(401).json({ mensagem: "É obrigatório informar a senha do banco!" });
    }

    let conta = contas.find((conta) => {
        return conta.numero == numero_conta;
    });

    if (senha != conta.usuario.senha) {
        return res.status(403).json({ mensagem: "A senha do banco informada é inválida!" });
    }

    next();
}

const verificarContaUnicaBody = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    contas = bd.lerBanco('contas');

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(401).json({ mensagem: "É obrigatório preencher todos os dados requisitados!" });
    }

    let conta = contas.find((conta) => {
        return (conta.usuario.cpf === cpf || conta.usuario.email === email);
    });

    if (conta) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    next();
}

const verificarNumeroContaEValorBody = (req, res, next) => {
    const { numero_conta, valor } = req.body;
    contas = bd.lerBanco('contas');

    if (!numero_conta) {
        return res.status(401).json({ mensagem: "É obrigatório preencher o número da conta!" });
    }

    if (!valor || valor < 0) {
        return res.status(401).json({ mensagem: "É obrigatório informar um valor válido, números negativos ou zerados não são permitidos!" });
    }

    let conta = contas.find((conta) => {
        return conta.numero == numero_conta;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: "A conta bancária não foi encontrada!" });
    }

    next();
}

module.exports = {
    verificarSenhaBancoQuery,
    verificarNumeroContaESenhaQuery,
    verificarNumeroContaParams,
    verificarSenhaContaBody,
    verificarContaUnicaBody,
    verificarNumeroContaEValorBody
}