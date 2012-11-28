//var assert  = require('assert');
var expects = require('../lib/expects');

module.exports["Verifier:  type"] = function(test) {
	var result = expects.verifierKeys["type"].verifier("somekey", "somevalue", "string");
	test.ok(true === result, result);
	test.done();
};

module.exports["Verifier:  type (fail)"] = function(test) {
	var result = expects.verifierKeys["type"].verifier("somekey", {}, "string");
	test.ok(true !== result, result);
	test.done();
};

module.exports["Verifier:  presence"] = function(test) {
	var result = expects.verifierKeys["presence"].verifier("somekey", "somevalue", "required");
	test.ok(true === result, result);
	test.done();
};

module.exports["Verifier:  presence not required"] = function(test) {
	var result = expects.verifierKeys["presence"].verifier("somekey", null, "opt");
	test.ok('skip' === result, result);
	test.done();
};

module.exports["Verifier:  presence (fail)"] = function(test) {
	var result = expects.verifierKeys["presence"].verifier("somekey", null, "required");
	test.ok(true !== result, "Presence required");
	test.done();
};

module.exports["Verifier:  validator invalid"] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("somekey", "somevalue", "invalid validator");
	test.ok(/Validator for key .* not valid/.test(result), "Invalid validator not detected");
	test.done();
};

module.exports["Verifier:  validator (regexp)"] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("someregexpkey", "somevalue", /^somevalue$/);
	test.equal(true, result);
	test.done();
};

module.exports["Verifier:  validator (regexp, fail"] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("someregexpfailkey", "somefailvalue", /^someothervalue$/);
	test.ok(true !== result, result);
	test.done();
};

module.exports["Verifier:  validator (function)"] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("somekey", "somevalue", function(input) { return "somevalue" == input });
	test.ok(true === result, result);
	test.done();
};

module.exports["Verifier:  validator (function, fail"] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("somekey", "somefailvalue", function(input) { return "somefailvalue" != input });
	test.ok(true != result, result);
	test.done();
};

module.exports["Verifier:  url preset "] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("somekey", "http://somedomain.com:3327", expects.requiredURL.validator);
	test.ok(true === result, result);
	test.done();
};

module.exports["Verifier:  url preset (no protocol)"] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("somekey", "somedomain.com:3327", expects.requiredURL.validator);
	test.ok(true === result, result);
	test.done();
};

module.exports["Verifier:  url preset (fail)"] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("somekey", "http://somedomain:com", expects.requiredURL.validator);
	test.ok(true !== result, result);
	test.done();
};

module.exports["Verifier:  IPv4 preset"] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("someIP", "1.2.3.4", expects.requiredIPV4.validator);
	test.ok(true === result, result);
	test.done();
};

module.exports["Verifier:  IPv4 preset (fail)"] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("someIP", "1.invalid.3.4", expects.requiredIPV4.validator);
	test.ok(true !== result, result);
	test.done();
};

module.exports["Verifier:  parseableInt preset"] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("someIP", "12345", expects.requiredParseableInt.validator);
	test.ok(true === result, result);
	test.done();
};

module.exports["Verifier:  parseableInt (fail)"] = function(test) {
	var result = expects.verifierKeys["validator"].verifier("someIP", "NaN", expects.requiredParseableInt.validator);
	test.ok(true !== result, result);
	test.done();
};

module.exports["Verifier:  parseableNumber preset, int"] = function(test) {
  var result = expects.verifierKeys["validator"].verifier("parseableNumber", "12", expects.requiredParseableNumber.validator);
  test.ok(true === result, result);
  test.done();
};

module.exports["Verifier:  parseableNumber preset, float"] = function(test) {
  var result = expects.verifierKeys["validator"].verifier("parseableNumber", "12.123", expects.requiredParseableNumber.validator);
  test.ok(true === result, result);
  test.done();
};

module.exports["Verifier:  parseableNumber (fail)"] = function(test) {
  var result = expects.verifierKeys["validator"].verifier("parseableNumber", "12,234", expects.requiredParseableNumber.validator);
  test.ok(true !== result, result);
  test.done();
};

module.exports["Verify pattern 1, pass"] = function(test) {
	
	var conf = {
		toplevel1 : {
			sublevel1 : "val1"
		}
	};
	
	var pattern = {
		toplevel1 : {
			type	 : "object",
			presence : 'req',
			pattern  : {
				sublevel1 : {
					presence  : 'opt',
					type	  : 'string',
					validator : /^val1$/
				}
			}
		}
	};
	
	var result = expects.verify(conf, pattern);
	test.ok(true === result, result);
	test.done();
};

module.exports["Verify pattern 1, fail"] = function(test) {
	
	var conf = {
		toplevel1 : {
			sublevel1 : {}
		}
	};
	
	var failPattern = {
		toplevel1 : {
			type	 : "object",
			presence : 'req',
			pattern  : {
				sublevel1 : {
					presence  : 'required',
					type	  : 'function',
					validator : /^val1$/
				}
			}
		}
	};
	
	var result = expects.verify(conf, failPattern);
	test.ok(true !== result, result);
	test.done();
};