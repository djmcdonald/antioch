module("Roman Numeral Service tests");
test("generates the 'I'", function() {
    equal(roman_numeral_service.generate(1), 'I');
});

test("should reset counter back to 'One'", function() {
});

