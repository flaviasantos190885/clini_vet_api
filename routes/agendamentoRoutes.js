const express = require('express');
const agendamentoController = require('../controllers/agendamentoController');

const router = express.Router();

// Rotas para agendamentos
router.get('/', agendamentoController.listar);
router.get('/data', agendamentoController.listarPorData);
router.get('/:id', agendamentoController.buscarPorId);
router.post('/', agendamentoController.criar);
router.put('/:id', agendamentoController.atualizar);
router.delete('/:id', agendamentoController.excluir);

module.exports = router;