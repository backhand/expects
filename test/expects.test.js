var assert  = require('assert');
var expects = require('../lib/expects');

module.exports["Verifier:  type"] = function() {
	var result = expects.verifierKeys["type"].verifier("somekey", "somevalue", "string");
	assert.ok(true === result, result);
};

module.exports["Verifier:  type (fail)"] = function() {
	var result = expects.verifierKeys["type"].verifier("somekey", {}, "string");
	assert.ok(true !== result, result);
};

module.exports["Verifier:  presence"] = function() {
	var result = expects.verifierKeys["presence"].verifier("somekey", "somevalue", "required");
	assert.ok(true === result, result);
};

module.exports["Verifier:  presence not required"] = function() {
	var result = expects.verifierKeys["presence"].verifier("somekey", null, "opt");
	assert.ok('skip' === result, result);
};

module.exports["Verifier:  presence (fail)"] = function() {
	var result = expects.verifierKeys["presence"].verifier("somekey", null, "required");
	assert.ok(true !== result, "Presence required");
};

module.exports["Verifier:  validator invalid"] = function() {
	var result = expects.verifierKeys["validator"].verifier("somekey", "somevalue", "invalid validator");
	assert.ok(/Validator for key .* not valid/.test(result), "Invalid validator not detected");
};

module.exports["Verifier:  validator (regexp)"] = function() {
	var result = expects.verifierKeys["validator"].verifier("someregexpkey", "somevalue", /^somevalue$/);
	assert.ok(true === result, result);
};

module.exports["Verifier:  validator (regexp, fail"] = function() {
	var result = expects.verifierKeys["validator"].verifier("someregexpfailkey", "somefailvalue", /^someothervalue$/);
	assert.ok(true !== result, result);
};

module.exports["Verifier:  validator (function)"] = function() {
	var result = expects.verifierKeys["validator"].verifier("somekey", "somevalue", function(input) { return "somevalue" == input });
	assert.ok(true === result, result);
};

module.exports["Verifier:  validator (function, fail"] = function() {
	var result = expects.verifierKeys["validator"].verifier("somekey", "somefailvalue", function(input) { return "somefailvalue" != input });
	assert.ok(true != result, result);
};

module.exports["Verifier:  url preset "] = function() {
	var result = expects.verifierKeys["validator"].verifier("somekey", "http://somedomain.com:3327", expects.requiredURL.validator);
	assert.ok(true === result, result);
};

module.exports["Verifier:  url preset (no protocol)"] = function() {
	var result = expects.verifierKeys["validator"].verifier("somekey", "somedomain.com:3327", expects.requiredURL.validator);
	assert.ok(true === result, result);
};

module.exports["Verifier:  url preset (fail)"] = function() {
	var result = expects.verifierKeys["validator"].verifier("somekey", "http://somedomain:com", expects.requiredURL.validator);
	assert.ok(true !== result, result);
};

module.exports["Verifier:  IPv4 preset"] = function() {
	var result = expects.verifierKeys["validator"].verifier("someIP", "1.2.3.4", expects.requiredIPV4.validator);
	assert.ok(true === result, result);
};

module.exports["Verifier:  IPv4 preset (fail)"] = function() {
	var result = expects.verifierKeys["validator"].verifier("someIP", "1.invalid.3.4", expects.requiredIPV4.validator);
	assert.ok(true !== result, result);
};

module.exports["Verifier:  parseableInt preset"] = function() {
	var result = expects.verifierKeys["validator"].verifier("someIP", "12345", expects.requiredParseableInt.validator);
	assert.ok(true === result, result);
};

module.exports["Verifier:  parseableInt (fail)"] = function() {
	var result = expects.verifierKeys["validator"].verifier("someIP", "NaN", expects.requiredParseableInt.validator);
	assert.ok(true !== result, result);
};

module.exports["Verify pattern 1, pass"] = function() {
	
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
	assert.ok(true === result, result);
};

module.exports["Verify pattern 1, fail"] = function() {
	
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
	assert.ok(true !== result, result);
};