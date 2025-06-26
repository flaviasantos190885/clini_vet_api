const express = require('express');
const router = express.Router();
const FaturaController = require('../controllers/faturaController');

router.get('/', FaturaController.listar);
router.get('/:id', FaturaController.buscarPorId);
router.post('/', FaturaController.criar);
router.put('/:id', FaturaController.atualizar);
router.delete('/:id', FaturaController.excluir);

module.exports = router;