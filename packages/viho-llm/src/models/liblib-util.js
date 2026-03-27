// crypto
import crypto from 'crypto';

// https
import https from 'https';

// Logger
import { Logger } from 'qiao.log.js';
const logger = Logger('liblib-util.js');

/**
 * generateSignature
 * @param {*} uri
 * @param {*} secretKey
 * @returns
 */
export const generateSignature = (uri, secretKey) => {
  const timestamp = String(Date.now());
  const signatureNonce = crypto.randomBytes(8).toString('hex');
  const content = `${uri}&${timestamp}&${signatureNonce}`;

  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(content);
  const signature = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return { signature, timestamp, signatureNonce };
};

/**
 * request
 * @param {*} baseURL
 * @param {*} accessKey
 * @param {*} secretKey
 * @param {*} uri
 * @param {*} body
 * @returns
 */
export const request = (baseURL, accessKey, secretKey, uri, body) => {
  const methodName = 'request';

  return new Promise((resolve, reject) => {
    const { signature, timestamp, signatureNonce } = generateSignature(uri, secretKey);
    const query =
      `AccessKey=${accessKey}` +
      `&Signature=${signature}` +
      `&Timestamp=${timestamp}` +
      `&SignatureNonce=${signatureNonce}`;

    const postData = JSON.stringify(body);

    const options = {
      hostname: baseURL,
      path: `${uri}?${query}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          logger.error(methodName, 'JSON parse error', data);
          reject(new Error('JSON parse error: ' + data));
        }
      });
    });

    req.on('error', (error) => {
      logger.error(methodName, 'request error', error);
      reject(error);
    });
    req.write(postData);
    req.end();
  });
};

/**
 * text2img
 * @param {*} baseURL
 * @param {*} accessKey
 * @param {*} secretKey
 * @param {*} prompt
 * @param {*} options
 * @returns
 */
export const text2img = (baseURL, accessKey, secretKey, prompt, options) => {
  const methodName = 'text2img';

  // check
  if (!prompt) {
    logger.error(methodName, 'need prompt');
    return;
  }

  options = options || {};
  const generateParams = {
    prompt: prompt,
    aspectRatio: options.aspectRatio || 'portrait',
    imgCount: options.imgCount || 1,
    steps: options.steps || 30,
  };

  if (options.width && options.height) {
    delete generateParams.aspectRatio;
    generateParams.imageSize = {
      width: options.width,
      height: options.height,
    };
  }

  if (options.controlnet) {
    generateParams.controlnet = options.controlnet;
  }

  return request(baseURL, accessKey, secretKey, '/api/generate/webui/text2img/ultra', {
    templateUuid: '5d7e67009b344550bc1aa6ccbfa1d7f4',
    generateParams: generateParams,
  });
};

/**
 * img2img
 * @param {*} baseURL
 * @param {*} accessKey
 * @param {*} secretKey
 * @param {*} prompt
 * @param {*} sourceImage
 * @param {*} options
 * @returns
 */
export const img2img = (baseURL, accessKey, secretKey, prompt, sourceImage, options) => {
  const methodName = 'img2img';

  // check
  if (!prompt) {
    logger.error(methodName, 'need prompt');
    return;
  }
  if (!sourceImage) {
    logger.error(methodName, 'need sourceImage');
    return;
  }

  options = options || {};
  const generateParams = {
    prompt: prompt,
    sourceImage: sourceImage,
    imgCount: options.imgCount || 1,
  };

  if (options.controlnet) {
    generateParams.controlnet = options.controlnet;
  }

  return request(baseURL, accessKey, secretKey, '/api/generate/webui/img2img/ultra', {
    templateUuid: '07e00af4fc464c7ab55ff906f8acf1b7',
    generateParams: generateParams,
  });
};

/**
 * queryStatus
 * @param {*} baseURL
 * @param {*} accessKey
 * @param {*} secretKey
 * @param {*} generateUuid
 * @returns
 */
export const queryStatus = (baseURL, accessKey, secretKey, generateUuid) => {
  return request(baseURL, accessKey, secretKey, '/api/generate/webui/status', {
    generateUuid: generateUuid,
  });
};

/**
 * waitForResult
 * @param {*} baseURL
 * @param {*} accessKey
 * @param {*} secretKey
 * @param {*} generateUuid
 * @param {*} intervalMs
 * @param {*} maxRetries
 * @returns
 */
export const waitForResult = (baseURL, accessKey, secretKey, generateUuid, intervalMs, maxRetries) => {
  intervalMs = intervalMs || 3000;
  maxRetries = maxRetries || 60;

  return new Promise((resolve, reject) => {
    let attempt = 0;

    function poll() {
      attempt++;
      queryStatus(baseURL, accessKey, secretKey, generateUuid)
        .then((res) => {
          const status = res.data && res.data.generateStatus;

          if (status === 5) {
            return resolve(res.data);
          }
          if (status === 6 || status === 7) {
            return reject(new Error('Generation failed: ' + (res.data.generateMsg || 'unknown')));
          }

          if (attempt >= maxRetries) {
            return reject(new Error('Polling timeout after ' + maxRetries + ' retries'));
          }

          setTimeout(poll, intervalMs);
        })
        .catch(reject);
    }

    poll();
  });
};
