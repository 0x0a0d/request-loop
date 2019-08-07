const Request = require('request-promise-native');

function initParams(url, options, timeout) {
  if (typeof url === 'object') {
    timeout = options || 10;
    options = url;
  } else {
    options = options || {};
    options.url = url;
  }
  return {
    options,
    timeout
  }
}
async function request(url, opt, timeout = 10) {
  const param = initParams(url, opt, timeout);
  try {
    return await request.requester(param.options);
  } catch (e) {
    if (param.timeout > 0) return await request(param.options, param.timeout - 1);
    throw e;
  }
}
function verbFunc(verb) {
  verb = verb.toUpperCase();
  return function verbWrap(url, options) {
    const param = initParams(url, options);
    param.options.method = verb;
    return request(param.options);
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
request.requester = Request;
request.defaults = function(options) {
  request.requester = request.requester.defaults(options);
  return request;
};

module.exports = request;
