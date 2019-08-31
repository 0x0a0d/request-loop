const Request = require('request-promise-native');

function initParams(url, options, retryTimes) {
  if (typeof url === 'object') {
    retryTimes = options == null ? 10 : options;
    options = url;
  } else {
    options = options || {};
    options.url = url;
  }
  return {
    options,
    retryTimes
  }
}

module.exports = function requestLoop(_requester) {
  if (this.constructor !== requestLoop) {
    return new requestLoop(_requester);
  }
  if (_requester == null) {
    _requester = Request;
  }
  async function request(url, opt, retryTimes = 10) {
    const param = initParams(url, opt, retryTimes);
    try {
      return await _requester(param.options);
    } catch (e) {
      if (e.name === 'StatusCodeError') {
        throw e;
      } else if (e.name === 'TransformError') {
        throw e;
      } else if (param.retryTimes > 0) {
        return await request(param.options, param.retryTimes - 1);
      }
      throw e;
    }
  }
  function verbFunc(verb) {
    verb = verb.toUpperCase();
    return function verbWrap(url, options, timeout) {
      const param = initParams(url, options, timeout);
      param.options.method = verb;
      return request(param.options, param.retryTimes);
    };
  }
// define like this to please codeintel/intellisense IDEs
  request.get = verbFunc('get');
  request.head = verbFunc('head');
  request.options = verbFunc('options');
  request.post = verbFunc('post');
  request.put = verbFunc('put');
  request.patch = verbFunc('patch');
  request.del = verbFunc('delete');
  request['delete'] = verbFunc('delete');
  // request.requester = Request;
  request.defaults = function(options) {
    const requester = _requester.defaults(options);
    return new requestLoop(requester);
  };
  return request;
};
