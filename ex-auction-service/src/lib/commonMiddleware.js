import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import eventNormalizer from '@middy/http-event-normalizer';
import errorHandler from 'middy-middleware-json-error-handler';
import cors from '@middy/http-cors';

export default (handler) =>
  middy(handler).use([
    jsonBodyParser(),
    eventNormalizer(),
    errorHandler(),
    cors()
  ]);
