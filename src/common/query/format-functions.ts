const {
  addIndex,
  applySpec,
  cond,
  flatten,
  prop,
  map,
  mapObjIndexed,
  values,
  pipe,
  always,
  head,
  identity,
  ifElse,
  when,
  type,
  equals,
  complement,
  unapply,
  nth,
  T,
} = require('ramda');

const mapIndexed = addIndex(map);

const getSecondArg = pipe(unapply(identity), nth(1));

const stringifyValue = when(pipe(type, complement(equals('String'))), JSON.stringify);

const getName = (idx, data) => `$or.${idx}.${data}`;

export const formatSort = pipe(
  mapObjIndexed(
    applySpec({
      fieldName: getSecondArg,
      method: prop('method'),
      order: prop('order'),
    }),
  ),
  values,
);

export const formatFilters = pipe(
  mapObjIndexed(
    cond([
      [
        pipe(type, equals('Object')),
        applySpec({
          fieldName: getSecondArg,
          operator: pipe(mapObjIndexed(getSecondArg), values, head),
          value: pipe(values, head, stringifyValue),
        }),
      ],
      [
        pipe(type, equals('Array')),
        mapIndexed((val, idx) =>
          pipe(
            mapObjIndexed(
              ifElse(
                pipe(type, equals('Object')),
                applySpec({
                  fieldName: pipe(unapply(identity), nth(1), getName.bind(null, idx)),
                  operator: pipe(mapObjIndexed(getSecondArg), values, head),
                  value: pipe(values, head, stringifyValue),
                }),
                applySpec({
                  fieldName: pipe(unapply(identity), nth(1), getName.bind(null, idx)),
                  operator: always('$eq'),
                  value: pipe(identity, stringifyValue),
                }),
              ),
            ),
            values,
          )(val),
        ),
      ],
      [
        T,
        applySpec({
          fieldName: getSecondArg,
          operator: always('$eq'),
          value: pipe(identity, stringifyValue),
        }),
      ],
    ]),
  ),
  values,
  flatten,
);

export const formatPagination = when(equals('all'), always({ limit: 0, offset: 0 }));
