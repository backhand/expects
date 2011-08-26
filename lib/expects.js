
// Verifiers
var verifiers = [
	// Tests for presence of value (if not present and presence is not 'req|required' return 'skip', signalling further verifier tests are unnecessary)
	{ name     : "presence",
	  verifier : function(key, input, setting) {
				  	return null == input ? 
						['req','required'].indexOf(setting) >= 0 ? "Value '"+key+"' required" : 'skip' : true;
			     }
	},
	
	// Tests for type of value
	{ name     : "type",
	  verifier : function(key, input, setting) {
				  	return setting == (typeof input) ? true : "Value '"+key+"' is type "+(typeof input)+", expected " + setting;
			  	 }
	},
    
    // Tests value against a validator, either a function or a regexp
    { name     : "validator",
      verifier : function(key, input, setting) {
			    	if(typeof setting == 'function') {
			    		var result = typeof setting["test"] == 'function' ? setting.test(input) : setting(input);
			    		return true == result ? true : "Validator for key '"+key+"' failed"; 
			    	} else {
			    		return "Validator for key '"+key+"' not valid";
			    	}
		      	 }
	},
    
    // Tests sub-settings
    { name    : "pattern",
      verifier: function(key, input, setting) {
			    	var verified = verify(input, setting);
			    	return true === verified ? true : verified;
		      	}
	}
];
var verifierKeys = {
	"presence" 	: verifiers[0],
	"type" 		: verifiers[1],
	"validator" : verifiers[2],
	"pattern" 	: verifiers[3]
};

function verify(input, pattern) {
	if(null == pattern) {
		return "Pattern not defined";
	}
	// Iterate over input settings 
	for(var p in pattern) {
		// Iterate over verifier functions
		for(var vi in verifiers) {
			var v 		 = verifiers[vi].name;
			var verifier = verifiers[vi].verifier;
			// Check if verifier is defined
			if(null != pattern[p][v]) {
				// Test verifier, if result is not true, return it 
				var test = verifier(p, input[p], pattern[p][v]);
				if('skip' == test) // Mainly here to skip type test if value was optional and not found 
					break;
				if(true !== test)
					return test;									
			}
		};
	};
	
	return true;
};

function read(filename, pattern) {
	var conf   = require(filename);
	var result = verify(conf, pattern);
	
	if(true !== result)
		throw result;
	else
		return conf;
}

// Hostname regexp found on http://stackoverflow.com/questions/106179/regular-expression-to-match-hostname-or-ip-address, slightly modified
var URLRegexp = /^(http:\/\/)?(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])(:\d{1,5})?(\/.*)?$/;

exports.verifierKeys = verifierKeys;
exports.verifiers    = verifiers;
exports.verify 	     = verify;
exports.read		 = read;
exports.read		 = read;

exports.requiredString = { presence: 'required', type: 'string' };
exports.optionalString = { presence: 'optional', type: 'string' };

exports.requiredNumber = { presence: 'required', type: 'number' };
exports.optionalNumber = { presence: 'optional', type: 'number' };

exports.requiredParseableInt = { presence: 'required', type: 'string', validator : /^\d+$/ };
exports.optionalParseableInt = { presence: 'optional', type: 'string', validator : /^\d+$/ };

exports.requiredURL    = { presence: 'required', type: 'string', validator: URLRegexp };
exports.optionalURL    = { presence: 'optional', type: 'string', validator: URLRegexp };

exports.requiredPort    = { presence: 'required', type: 'number', validator: function(input) { return input > 0 && input <= 65535} };
exports.optionalPort    = { presence: 'optional', type: 'number', validator: function(input) { return input > 0 && input <= 65535} };

exports.requiredIPV4    = { presence: 'required', type: 'string', validator: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/ };
exports.optionalIPV4    = { presence: 'optional', type: 'string', validator: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/ };
