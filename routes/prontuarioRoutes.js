const express = require('express');
const prontuarioController = require('../controllers/prontuarioController');

const router = express.Router();

// Rotas para prontuários
router.get('/', prontuarioController.listar);
router.get('/:id', prontuarioController.buscarPorId);
router.post('/', prontuarioController.criar);
router.put('/:id', prontuarioController.atualizar);
router.delete('/:id', prontuarioController.excluir);

module.exports = router;