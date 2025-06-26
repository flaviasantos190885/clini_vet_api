const express = require('express');
const router = express.Router();
const VacinaController = require('../controllers/vacinaController');

router.get('/', VacinaController.listar);
router.get('/:id', VacinaController.buscarPorId);
router.post('/', VacinaController.criar);
router.put('/:id', VacinaController.atualizar);
router.delete('/:id', VacinaController.excluir);

module.exports = router;    