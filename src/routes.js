/**
 * API description
 */
const router = require('express').Router();

const HttpError = require('./helpers/http-error');

const ctrl = require('./controllers/api.controller');
const val = require('./validators/api.validator');

module.exports = router;

/* Routes */
router.get('/', ctrl.pull);
router.get('/:taskId', ctrl.check, ctrl.get);
router.post('/', val.create, ctrl.newId, ctrl.create);
router.post('/:taskId', val.create, ctrl.create);
router.patch('/:taskId', val.update, ctrl.check, ctrl.update);
router.delete('/:taskId', ctrl.check, ctrl.remove);

router.use((req, res, next) => {
    throw new HttpError(404);
});
