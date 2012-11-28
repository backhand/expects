
Argument verification for node.js
===

[![Build Status](https://secure.travis-ci.org/backhand/expects.png?branch=master)](https://travis-ci.org/backhand/expects)

To run the tests (requires nodeunit):

	nodeunit test/

Quick rundown:
---
Expects verifies a json object, recursively checking that specified properties exists and/or conforms to certain patterns. It does this by 
comparing to json objects, first being the object to check, the second being a representation of the expected data. This representation should 
be structured like the expected data, but having verifiers in place of the values. A verifier can be a function or a regexp.

E.g. if the json object expected looks like this (assuming all values are required):
    {
    	someValue : <integer>,
    	someOther : { checkThis : <string> }
    }

the pattern would look like this, using the built-in verifiers requiredInt and requiredString:
    {
    	someValue : expects.requiredInt,
    	someOther : { type : "object", presence : "req", pattern : {
    		checkThis : expects.requiredString
    	} }
    }

Expects will throw an error on unsatisfied requirements, stating the first failed value encountered.

List of verifiers:
---
    expects.requiredString - String, required
    expects.optionalString - String, optional

    expects.requiredNumber - Integer, required,
    expects.optionalNumber - Integer, optional

    expects.requiredParseableInt - Integer-parseable string, required
    expects.optionalParseableInt - Integer-parseable string, optional

    expects.requiredURL - Full URL with protocol (only http accepted), domain|IP, port (optional), path (optional) and query (optional), required
    expects.optionalURL - Full URL with protocol (only http accepted), domain|IP, port (optional), path (optional) and query (optional), optional

    expects.requiredPort    = Integer in the range ]1:65535], required
    expects.optionalPort    = Integer in the range ]1:65535], optional

    expects.requiredIPV4    = String representing a valid IPv4, required
    expects.optionalIPV4    = String representing a valid IPv4, optional