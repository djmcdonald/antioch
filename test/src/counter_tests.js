var counter;
module("Counter tests", {
    setup: function() {
        counter = new Counter();
    }, teardown: function() {
        console.log("end");
    }
});

test("should return fixed Antioch count", function() {
    equal(counter.count(), 'One');
    equal(counter.count(), 'Two');
});

test("should reset counter back to 'One'", function() {
    counter.count();

    counter.reset();
    equal(counter.count(), 'One');
});

