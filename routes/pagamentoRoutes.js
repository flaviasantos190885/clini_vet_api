const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController'); // <-- Nome do arquivo em camelCase

router.get('/', pagamentoController.listar);
router.get('/:id', pagamentoController.buscarPorId);
router.post('/', pagamentoController.criar);
router.put('/:id', pagamentoController.atualizar);
router.delete('/:id', pagamentoController.excluir);

module.exports = router;