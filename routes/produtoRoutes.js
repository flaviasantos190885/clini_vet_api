const express = require('express');
const produtoController = require('../controllers/produtoController');

const router = express.Router();

// Rotas para produtos
router.get('/', produtoController.listar);
router.get('/estoque-baixo', produtoController.listarEstoqueBaixo);
router.get('/:id', produtoController.buscarPorId);
router.post('/', produtoController.criar);
router.put('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.excluir);

module.exports = router;