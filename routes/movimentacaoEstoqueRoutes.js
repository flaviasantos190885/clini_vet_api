const express = require('express');
const router = express.Router();
const movimentacaoEstoqueController = require('../controllers/movimentacaoEstoqueController');

router.get('/', movimentacaoEstoqueController.listar);
router.get('/:id', movimentacaoEstoqueController.buscarPorId);
router.post('/', movimentacaoEstoqueController.criar);
router.put('/:id', movimentacaoEstoqueController.atualizar);
router.delete('/:id', movimentacaoEstoqueController.excluir);

module.exports = router;