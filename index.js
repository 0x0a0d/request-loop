const Request = require('request-promise-native');

function initParams(url, options, timeout) {
  if (typeof url === 'object') {
    timeout = options == null ? 10 : options;
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


module.exports = function requestLoop() {
  if (this.constructor !== requestLoop) {
    return new requestLoop();
  }
  async function request(url, opt, timeout = 10) {
    const param = initParams(url, opt, timeout);
    try {
      return await request.requester(param.options);
    } catch (e) {
      if (e.name === 'StatusCodeError') {
        throw e;
      }
      else if (param.timeout > 0) {
        return new Promise((resolve, reject) => {
          setImmediate(()=>{
            request(param.options, param.timeout - 1)
              .then(resolve).catch(reject);
          })
        });
        // return await request(param.options, param.timeout - 1);
      }
      throw e;
    }
  }
  function verbFunc(verb) {
    verb = verb.toUpperCase();
    return function verbWrap(url, options, timeout) {
      const param = initParams(url, options, timeout);
      param.options.method = verb;
      return request(param.options, param.timeout);
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
  return request;
};
