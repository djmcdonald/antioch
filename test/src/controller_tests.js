
var controller, counter;

module("Controller tests", {
    setup: function() {
        controller = new Controller();
        counter = { count: sinon.stub(), reset: sinon.stub() };
        controller.counter = counter;
    },
    teardown: function() {
    }
});

test("should engage count animation with correct count", function() {
    // tell the stub on counter what mock value to return
    counter.count.returns('Two');
    // spy on the display method in the controller for later test assertion
    controller.displayMessage = sinon.spy();

    // engage test
    controller.animateText();

    // test success
    equal(controller.displayMessage.calledWith('Two'), true);
});