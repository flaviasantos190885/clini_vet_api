const express = require('express');
const router = express.Router();
const atendimentoFaturaController = require('../controllers/atendimentoFaturaController');

router.get('/', atendimentoFaturaController.listar);
router.get('/:id', atendimentoFaturaController.buscarPorId);
router.post('/', atendimentoFaturaController.criar);
router.put('/:id', atendimentoFaturaController.atualizar);
router.delete('/:id', atendimentoFaturaController.excluir);

module.exports = router;    