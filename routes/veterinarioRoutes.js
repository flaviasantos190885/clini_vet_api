const express = require('express');
const router = express.Router();
const VeterinarioController = require('../controllers/veterinarioController');

router.get('/', VeterinarioController.listar);
router.get('/:id', VeterinarioController.buscarPorId);
router.post('/', VeterinarioController.criar);
router.put('/:id', VeterinarioController.atualizar);
router.delete('/:id', VeterinarioController.excluir);

module.exports = router;