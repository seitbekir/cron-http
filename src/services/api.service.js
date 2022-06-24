/**
 * this is the CRUD access to tasks we store in our system.
 * It is only hase a list of tasks. Not execution of them.
 */
const datastore = require('nedb-promises');

const STORE_FILE = process.env.STORE_FILE || '/data/data.db';

const HttpError = require('../helpers/http-error');

const Task = require('../models/task.model');

/* Definition */
module.exports = {
    find,
    findById,
    findByNextTime,
    create,
    update,
    remove,
};

const db = datastore.create(STORE_FILE);

/* Public */
/**
 * Finds Tasks by filter
 * @param {any} filters Mongo filter query
 * @returns {Task[]} List of Tasks
 * @throws {Error}
 */
async function find(filters = {}) {
    const tasks = await db.find(filters);

    return tasks.map(doc => new Task(doc));
}

/**
 * Finds Task by it's Id
 * @param {String} id Task ID
 * @returns {Task} Found Task
 * @throws {HttpError|Error}
 */
async function findById(id) {
    const tasks = await find({ id });

    if (tasks.length === 1) {
        return tasks[0];
    }

    throw new HttpError(404, 'Task not found');
}

/**
 * Finds Task by it's next time
 * @param {Number} nextTime Task next time
 * @returns {Task[]} Found Tasks
 * @throws {HttpError|Error}
 */
async function findByNextTime(nextTime) {
    const tasks = await find({ nextTime: { $lte: nextTime }, disabled: false });

    return tasks;
}

/**
 * Creates Task in DB
 * @param {Task} task Task instance to be stored in DB
 * @returns {Task} Inserted Task
 * @throws {HttpError|Error}
 */
async function create(task) {
    if (task instanceof Task === false) {
        throw new HttpError(500);
    }

    await db.insert(task);

    return task;
}

/**
 * Updates Task in DB
 * @param {Task} task Task instance to be stored in DB
 * @returns {Task} Updated Task
 * @throws {HttpError|Error}
 */
async function update(task) {
    if (task instanceof Task === false) {
        throw new HttpError(500);
    }

    await db.update({ id: task.id }, task);

    return task;
}

/**
 * Removes Task from DB
 * @param {Task} task Task instance to be destroyed in DB
 * @returns {Task} Removed Task
 * @throws {HttpError|Error}
 */
async function remove(task) {
    if (task instanceof Task === false) {
        throw new HttpError(500);
    }

    await db.remove({ id: task.id });

    return task;
}
