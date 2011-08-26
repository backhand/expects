Argument verification for node.js
===

To run the tests:

	cd expects/
    expresso

Quick rundown:
Expects verifies a json object, recursively checking that specified properties exists and/or conforms to certain patterns. It does this by comparing to json objects, first being the object to check, the second being a representation of the expected data. This representation should be structured like the expected data, but having verifiers in place of the values. E.g. if the json object expected looks like this (assuming all values are required):
{
	someValue : <integer>,
	someOther : { checkThis : <string> }
}

the pattern would look like this:
{
	someValue : expects.requiredInt,
	someOther : { type : "object", presence : "req", pattern : {
		checkThis : expects.requiredString
	} }
}

Expects will throw an error on unsatisfied requirements, stating the first failed value encountered.