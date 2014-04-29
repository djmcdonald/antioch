(function() {

    var Counter = function() { this.init(); };
    Counter.prototype = {

        COUNT: null,

        init: function() {
            this.reset();
        },

        count: function() {
            return this.COUNT.shift();
        },

        reset: function() {
            this.COUNT = [ 'One', 'Two', 'Five!', 'Three Sir!', 'Three!' ];
        }
    };

    window.Counter = Counter;

}());