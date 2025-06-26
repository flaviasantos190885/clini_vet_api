const express = require('express');
const clienteRoutes = require('./clienteRoutes');
const animalRoutes = require('./animalRoutes');
const prontuarioRoutes = require('./prontuarioRoutes');
const agendamentoRoutes = require('./agendamentoRoutes');
const produtoRoutes = require('./produtoRoutes');

const router = express.Router();

// Definindo as rotas da API
router.use('/clientes', clienteRoutes);
router.use('/animais', animalRoutes);
router.use('/prontuarios', prontuarioRoutes);
router.use('/agendamentos', agendamentoRoutes);
router.use('/produtos', produtoRoutes);

// Rota de status da API
router.get('/status', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'API Clínica Veterinária funcionando corretamente',
    versao: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;