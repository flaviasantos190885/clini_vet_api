const express = require('express');
const router = express.Router();
const anexoProntuarioController = require('../controllers/anexoProntuarioController');

router.get('/', anexoProntuarioController.listar);
router.get('/:id', anexoProntuarioController.buscarPorId);
router.post('/', anexoProntuarioController.criar);
router.put('/:id', anexoProntuarioController.atualizar);
router.delete('/:id', anexoProntuarioController.excluir);

module.exports = router;