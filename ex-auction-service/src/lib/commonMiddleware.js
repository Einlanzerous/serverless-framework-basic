import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import eventNormalizer from '@middy/http-event-normalizer';
import errorHandler from 'middy-middleware-json-error-handler';

export default (handler) =>
  middy(handler).use([jsonBodyParser(), eventNormalizer(), errorHandler()]);
