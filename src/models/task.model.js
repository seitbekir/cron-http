const _ = require('lodash');
const dayjs = require('dayjs');
const { v4: uuid } = require('uuid');
const cronParser = require('cron-parser');
const momentTimezone = require('moment-timezone');
const HttpError = require('../helpers/http-error');

/**
 * Task Model
 */
class Task {
    constructor(task) {
        if (_.isNil(task)) {
            throw new HttpError(500, 'Requires initial object');
        }
        if (
            (_.isEmpty(task.expression) && _.isNil(task.theTime))
            || _.isEmpty(task.uri)
        ) {
            throw new HttpError(500, 'Required fields empty');
        }

        /**
         * Id of Task
         */
        this.id = task.id ? String(task.id) : uuid();

        /**
         * Time expression in CRON style
         */
        this.title = String(task.title);

        /**
         * Time expression in CRON style
         */
        this.expression = String(task.expression || '') || null;

        /**
         * Time of when has to be executed
         */
        this.theTime = Number(task.theTime) || null;
        /**
         * uri has to be called with this method
         */
        this.method = String(task.method);
        /**
         * uri has to be called on expression executes
         */
        this.uri = String(task.uri);

        /**
         * If the task has to remove itself after been called
         */
        this.suicide = Boolean(task.suicide) || false;
        /**
         * Number of times the task has been executed
         */
        this.executed = Number(task.executed) || 0;
        /**
         * while disabled is true Task will not be executed
         */
        this.disabled = Boolean(task.disabled) || false;
        /**
         * Set timezone to calc time with offset
         */
        this.timezone = String(task.timezone || '') || momentTimezone.tz.guess();

        /**
         * The Timestamp abs() of when the next act has to be activated
         */
        this.nextTime = Number(task.nextTime) || null;

        /**
         * Task cteated datetime
         */
        this.createdDateTime = Number(task.createdDateTime) || Date.now();
    }

    /**
     * To safely update data on existing Task use this function
     * @param {{ title?: string; expression?: string; uri?: string; suicide?: boolean; disabled?: boolean; }} task
     * @mutable
     */
    setData(task) {
        if (_.isNil(task)) {
            throw new HttpError(500, 'Requires initial object');
        }

        if (typeof task.title === 'string') {
            this.title = String(task.title);
        }

        if (typeof task.expression === 'string' && _.isNil(task.theTime)) {
            this.expression = String(task.expression);
        }
        if (typeof task.theTime === 'number' && _.isNil(task.expression)) {
            this.theTime = Number(task.theTime);
        }
        if (typeof task.method === 'string') {
            this.method = String(task.method);
        }
        if (typeof task.uri === 'string') {
            this.uri = String(task.uri);
        }

        if (typeof task.suicide === 'boolean') {
            this.suicide = Boolean(task.suicide) || false;
        }
        if (typeof task.disabled === 'boolean') {
            this.disabled = Number(task.disabled) || false;
        }
        if (typeof task.timezone === 'string') {
            this.timezone = String(task.timezone) || momentTimezone.tz.guess();
        }
    }

    /**
     * Increment of `executed` param
     */
    incExecuted() {
        this.executed++;
    }

    setNextTime(currentDate = Date.now()) {
        if (this.expression) {
            const date = cronParser.parseExpression(this.expression, { currentDate, tz: this.timezone });
            const nextTime = Number(date.next().toDate());

            if (Number.isNaN(nextTime) === false) {
                this.nextTime = nextTime;
                return;
            }
        }
        if (this.theTime) {
            const nextTime = dayjs(this.theTime).startOf('minute').valueOf();
            if (nextTime > Date.now()) {
                this.nextTime = nextTime;
                return;
            }
        }

        this.nextTime = null;
        this.disabled = true;
    }

    /**
     * This is the view to be returned to requeser
     */
    get shortView() {
        return {
            id: this.id,
            title: this.title,
            expression: this.expression || undefined,
            theTime: this.theTime || undefined,
            theTimeStr: this.theTime ? dayjs(this.theTime).format('YYYY-MM-DD HH:mm') : undefined,
            method: this.method,
            uri: this.uri,
            suicide: this.suicide,
            executed: this.executed,
            disabled: this.disabled,
            timezone: this.timezone,
        };
    }

    /**
     * This will be used to store to database
     */
    toJSON() {
        return {
            _id: this.id,
            ...this.shortView,
            nextTime: this.nextTime,
            createdDateTime: this.createdDateTime,
        };
    }
}

/* Definition */
module.exports = Task;
