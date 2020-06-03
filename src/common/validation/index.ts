import * as joi from 'joi';

export const sort = joi.object().keys({
  method: joi
    .string()
    .valid(['asc', 'desc'])
    .required(),
  order: joi.number().required(),
});

export const pagination = joi
  .object()
  .required()
  .keys({
    limit: joi
      .number()
      .integer()
      .positive()
      .required(),
    offset: joi
      .number()
      .integer()
      .min(0)
      .required(),
  });

export const stringFilters = joi
  .object()
  .min(1)
  .keys({
    $lt: joi
      .string()
      .trim()
      .min(1),
    $gt: joi
      .string()
      .trim()
      .min(1),
    $ilike: joi
      .string()
      .trim()
      .min(1),
    $eq: joi
      .string()
      .trim()
      .min(1),
    $ne: joi
      .string()
      .trim()
      .min(1),
    $in: joi.array().items(
      joi
        .string()
        .trim()
        .min(1),
    ),
    $nin: joi.array().items(
      joi
        .string()
        .trim()
        .min(1),
    ),
    $between: joi
      .array()
      .items(
        joi
          .string()
          .trim()
          .min(1),
      )
      .length(2),
  });

export const inArrFilterNumber = joi
  .object()
  .min(1)
  .keys({
    $inArr: joi.array().items(joi.number()),
  });

export const inArrFilterString = joi
  .object()
  .min(1)
  .keys({
    $inArr: joi.array().items(joi.string()),
  });

export const numberFilters = joi
  .object()
  .min(1)
  .keys({
    $eq: joi.number().description('Equal operator'),
    $ne: joi.number().description('Not equal operator'),
    $in: joi
      .array()
      .items(joi.number())
      .description('In operator'),
    $nin: joi
      .array()
      .items(joi.number())
      .description('Not In operator'),
    $gt: joi.number().description('Gretter That operator'),
    $gte: joi.number().description('Gretter or Equal operator'),
    $lt: joi.number().description('Lower That operator'),
    $lte: joi.number().description('Lower or Equal operator'),
    $gisSearch: joi.number().description('Search by coordinates'),
  });

export const gisNumberFilters = joi
  .object()
  .min(1)
  .keys({
    $eq: joi.number().description('Equal operator'),
  });

export const dateFilter = joi
  .object()
  .min(1)
  .keys({
    $eq: joi.string().description('Equal operator'),
    $ne: joi.string().description('Not equal operator'),
    $in: joi
      .array()
      .items(joi.string())
      .description('In operator'),
    $nin: joi
      .array()
      .items(joi.string())
      .description('Not In operator'),
    $gt: joi.string().description('Gretter That operator'),
    $gte: joi.string().description('Gretter or Equal operator'),
    $lt: joi.string().description('Lower That operator'),
    $lte: joi.string().description('Lower or Equal operator'),
    $between: joi
      .array()
      .items(
        joi
          .string()
          .trim()
          .min(1),
      )
      .length(2),
  });
