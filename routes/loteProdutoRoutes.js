const express = require('express');
const router = express.Router();
const loteProdutoController = require('../controllers/loteProdutoController');

router.get('/', loteProdutoController.listar);
router.get('/:id', loteProdutoController.buscarPorId);
router.post('/', loteProdutoController.criar);
router.put('/:id', loteProdutoController.atualizar);
router.delete('/:id', loteProdutoController.excluir);

module.exports = router;    