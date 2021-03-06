/**
 * This is the execution engine of tasks
 * Keep in mind, there should not be many tasks at the same time
 */
const dayjs = require('dayjs');
const request = require('request');

const apiService = require('./api.service');

// eslint-disable-next-line
const Task = require('../models/task.model');

/* Definition */
module.exports = {
    start() {
        start();

        console.info('Daemon activated');
    },
    autorize,
};

const headers = {};

/* Public */
function start() {
    const nextTick = dayjs()
        .add(1, 'minute')
        .startOf('minute')
        .diff(dayjs())
        .valueOf();

    setTimeout(() => {
        runTasks();
        start();
    }, nextTick);
}

async function autorize() {
    const token = process.env.HEADER_TOKEN;
    const headerName = process.env.HEADER_TOKEN_NAME;

    if (token && headerName) {
        headers[headerName] = token;

        console.info(`Autorized with ${headerName}: ${token}`);
    }
}

/* Private */
async function runTasks() {
    try {
        const nextTime = dayjs().startOf('minute').valueOf();

        const tasks = await apiService.findByNextTime(nextTime);

        if (tasks.length === 0) {
            return;
        }

        const promises = [];
        for (const task of tasks) {
            promises.push(
                action(task),
            );
        }

        await Promise.all(promises);
        console.log(`---- On ${dayjs(nextTime).format('YYYY-MM-DD HH:mm')} ----`);
    } catch (err) {
        console.error(err);
    }
}

/**
 * Get action of Task
 * @param {Task} task the task has to be run
 */
async function action(task) {
    try {
        if (task.disabled === true) {
            return;
        }

        await req(task.method, task.uri);

        console.info(`Task [${task.title}] has complete at [${dayjs(task.nextTime).format('YYYY-MM-DD HH:mm')}]`);
    } catch (err) {
        console.error(`Task [${task.title}] has failed with [${err.message}]`);
    } finally {
        task.setNextTime(Date.now());
        task.incExecuted();

        if (task.suicide) {
            console.info(`Task [${task.title}] has been removed`);
            await apiService.remove(task);
        } else {
            await apiService.update(task);
        }
    }
}

async function req(method, uri) {
    return new Promise((resolve, reject) => {
        request({
            uri,
            method,
            headers,
        }, (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}
