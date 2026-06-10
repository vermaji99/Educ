import { param, query, validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }
  next();
};

export const validateUsername = [
  param('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isAlphanumeric().withMessage('Username must be alphanumeric'),
  validate,
];

export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isString().withMessage('SortBy must be a string'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
  validate,
];
