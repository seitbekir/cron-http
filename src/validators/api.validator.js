/**
 * The validator of requrests
 */
const _ = require('lodash');
const Validator = require('week-validator');
const momentTimezone = require('moment-timezone');
const isURL = require('is-url');
const cronParser = require('cron-parser');

const HttpError = require('../helpers/http-error');

const {
    validator,
    required,
    default: def,
    ValidationError,
} = Validator;

/* Definition */
module.exports = {
    create,
    update,
};

/* Public */
async function create(req, res, next) {
    try {
        const val = new Validator();

        val.field('title', [
            required,
            validator(_.isString).message('Set title as String'),
        ]);
        if (req.body.expression) {
            val.field('expression', [
                def(null),
                validator(cronParser.parseExpression).message('Invalid CRON expression'),
            ]);
        }
        if (req.body.theTime) {
            val.field('theTime', [
                def(null),
                validator(_.isInteger).message('Date timestamp has to be BigInt number'),
                validator(value => value > Date.now()).message('Invalid Date timestamp in past'),
            ]);
        }
        if (_.isNil(req.body.theTime) && _.isNil(req.body.expression)) {
            val.field('when', [
                required,
            ]);
        }
        val.field('method', [
            def('GET'),
            validator(method).message('Unsupported method'),
        ]);
        val.field('uri', [
            required,
            validator(isURL),
        ]);
        val.field('suicide', [
            def(false),
            validator(_.isBoolean),
        ]);
        val.field('disabled', [
            def(false),
            validator(_.isBoolean),
        ]);
        val.field('timezone', [
            validator(value => momentTimezone.tz(value)).message('Unknown Timezone'),
        ]);

        req.form = await val.validate(req.body);

        return next();
    } catch (err) {
        if (err instanceof ValidationError) {
            return next(new HttpError(422, 'Invalid data', err.fields));
        }
        return next(new HttpError(500));
    }
}

async function update(req, res, next) {
    try {
        const val = new Validator();

        val.field('title', [
            def(null), // if not defined then data will not be updated
            validator(_.isString).message('Set title as String'),
        ]);
        if (req.body.expression) {
            val.field('expression', [
                def(null),
                validator(cronParser.parseExpression).message('Invalid CRON expression'),
            ]);
        }
        if (req.body.theTime) {
            val.field('theTime', [
                def(null),
                validator(_.isInteger).message('Date timestamp has to be BigInt number'),
                validator(value => value > Date.now()).message('Invalid Date timestamp in past'),
            ]);
        }
        if (_.isNil(req.body.theTime) && _.isNil(req.body.expression)) {
            val.field('when', [
                required,
            ]);
        }
        val.field('method', [
            def(null),
            validator(method).message('Unsupported method'),
        ]);
        val.field('uri', [
            def(null),
            validator(isURL),
        ]);
        val.field('suicide', [
            def(null),
            validator(_.isBoolean),
        ]);
        val.field('disabled', [
            def(null),
            validator(_.isBoolean),
        ]);
        val.field('timezone', [
            def(null),
            validator(value => momentTimezone.tz(value)).message('Unknown Timezone'),
        ]);

        req.form = await val.validate(req.body);

        return next();
    } catch (err) {
        if (err instanceof ValidationError) {
            return next(new HttpError(422, 'Invalid data', err.fields));
        }
        return next(new HttpError(500));
    }
}

/* Private */
function method(value) {
    return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(value);
}
