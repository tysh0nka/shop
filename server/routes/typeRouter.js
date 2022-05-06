const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const checkRole = require('../middleware/checkRoleMiddelware')

router.post('/', checkRole('ADMIN'), typeController.create)
router.get('/', typeController.get)

module.exports = router