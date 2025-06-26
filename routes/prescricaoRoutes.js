const express = require('express');
const router = express.Router();
const PrescricaoController = require('../controllers/prescricaoController');

router.get('/', PrescricaoController.listar);
router.get('/:id', PrescricaoController.buscarPorId);
router.post('/', PrescricaoController.criar);
router.put('/:id', PrescricaoController.atualizar);
router.delete('/:id', PrescricaoController.excluir);

module.exports = router;