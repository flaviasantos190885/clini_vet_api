const express = require('express');
const router = express.Router();
const itemFaturaController = require('../controllers/itemFaturaController'); // <-- Nome do arquivo em camelCase

router.get('/', itemFaturaController.listar);
router.get('/:id', itemFaturaController.buscarPorId);
router.post('/', itemFaturaController.criar);
router.put('/:id', itemFaturaController.atualizar);
router.delete('/:id', itemFaturaController.excluir);

module.exports = router;