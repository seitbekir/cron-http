/**
 * The controllers functions of REST API
 */
const { v4: uuid } = require('uuid');

const HttpError = require('../helpers/http-error');

const apiService = require('../services/api.service.js');

const Task = require('../models/task.model');

/* Definition */
module.exports = {
    check,
    newId,

    pull,
    get,
    create,
    update,
    remove,
};

/* Public */
/**
 * Set `req.task` to Task pulled by Id
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function check(req, res, next) {
    try {
        const { taskId } = req.params;

        const task = await apiService.findById(taskId);

        req.task = task;
        next();
    } catch (err) {
        next(err);
    }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function newId(req, res, next) {
    try {
        const taskId = uuid();

        req.params = req.params || {};
        req.params.taskId = taskId;

        next();
    } catch (err) {
        next(err);
    }
}

/**
 * @param {Request & { task: Task }} req
 * @param {Response} res
 * @param {Function} next
 */
async function pull(req, res, next) {
    try {
        const tasks = await apiService.find();

        if (tasks.length) {
            res.status(200).send(tasks.map(task => task.shortView));
        } else {
            res.status(204).send([]);
        }
    } catch (err) {
        next(err);
    }
}

/**
 * @param {Request & { task: Task }} req
 * @param {Response} res
 * @param {Function} next
 */
async function get(req, res, next) {
    try {
        const { task } = req;

        res.status(200).send(task.shortView);
    } catch (err) {
        next(err);
    }
}

/**
 * @param {Request & { task: Task }} req
 * @param {Response} res
 * @param {Function} next
 */
async function create(req, res, next) {
    try {
        const { taskId } = req.params;

        const _task = await apiService.findById(taskId).catch(() => null);

        if (_task) {
            throw new HttpError(409, 'Task on this Id already created');
        }

        const task = new Task({ ...req.form, id: taskId });
        task.setNextTime();

        await apiService.create(task);

        res.status(201).send(task.shortView);
    } catch (err) {
        next(err);
    }
}

/**
 * @param {Request & { task: Task }} req
 * @param {Response} res
 * @param {Function} next
 */
async function update(req, res, next) {
    try {
        const { task } = req;

        task.setData(req.form);

        await apiService.update(task);

        res.status(202).send(task.shortView);
    } catch (err) {
        next(err);
    }
}

/**
 * @param {Request & { task: Task }} req
 * @param {Response} res
 * @param {Function} next
 */
async function remove(req, res, next) {
    try {
        const { task } = req;

        await apiService.remove(task);

        res.status(200).send(task.shortView);
    } catch (err) {
        next(err);
    }
}
