const Crypto = require('crypto');
const _ = require('lodash');

module.exports.hasher = hasher;
module.exports.hide = hide;
module.exports.conditionalExtend = conditionalExtend;


function conditionalExtend (user, args, options) {
  var extra = _.omit(args, options.update.omit)
  _.map(extra, function (val, key) {
    if (!key.match(/\$/)) {
      user[key] = val
    }
  })
}

/**
 * Hash password with sha256
 * @param  {String}   src    String to hash
 * @param  {Number}   rounds Number of round
 * @param  {Function} done   Callback function
 */
function hasher (src, rounds, done) {
  var out = src;
  var i = 0;

  // don't chew up the CPU
  function round () {
    i++
    var shasum = Crypto.createHash('sha256')
    shasum.update(out, 'utf8')
    out = shasum.digest('hex')
    if (rounds <= i) {
      return done(out)
    }
    if (0 === i % 88) {
      return process.nextTick(round);
    }
    round()
  }

  round()
}

/**
 * Hide object property
 * @param  {object} args      Object with properties
 * @param  {array} propnames  Properties to hide (ie. [{"name": "password","hide": true}]
 * @return {object}           Object with hidden properties
 */
function hide (args, propnames) {
  var outargs = _.extend({}, args)
  for (var pn of propnames) {
    if (pn.hide) {
      outargs[pn.name] = '[HIDDEN]'
    }
  }
  return outargs
}
