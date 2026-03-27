// util
import { text2img, img2img, queryStatus, waitForResult } from './liblib-util.js';

// Logger
import { Logger } from 'qiao.log.js';
const logger = Logger('liblib.js');

/**
 * LibLibAPI
 * @param {*} options
 * @returns
 */
export const LibLibAPI = (options) => {
  const methodName = 'LibLibAPI';

  // check
  if (!options) {
    logger.error(methodName, 'need options');
    return;
  }
  if (!options.accessKey) {
    logger.error(methodName, 'need options.accessKey');
    return;
  }
  if (!options.secretKey) {
    logger.error(methodName, 'need options.secretKey');
    return;
  }

  // config
  const baseURL = options.baseURL || 'openapi.liblibai.cloud';
  const accessKey = options.accessKey;
  const secretKey = options.secretKey;

  // liblib
  const liblib = {};

  // text2img
  liblib.text2img = async (prompt, imgOptions) => {
    return await text2img(baseURL, accessKey, secretKey, prompt, imgOptions);
  };

  // img2img
  liblib.img2img = async (prompt, sourceImage, imgOptions) => {
    return await img2img(baseURL, accessKey, secretKey, prompt, sourceImage, imgOptions);
  };

  // queryStatus
  liblib.queryStatus = async (generateUuid) => {
    return await queryStatus(baseURL, accessKey, secretKey, generateUuid);
  };

  // waitForResult
  liblib.waitForResult = async (generateUuid, intervalMs, maxRetries) => {
    return await waitForResult(baseURL, accessKey, secretKey, generateUuid, intervalMs, maxRetries);
  };

  //
  return liblib;
};
