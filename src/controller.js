(function() {

    var Controller = function() { this.init(); };
    Controller.prototype = {
        // audio
        background_audio: null,
        throw_audio: null,
        worms_audio: null,
        explosion_audio: null,
        // image
        caerbannog: null,

        // display objects
        stage: null,
        canvasElm: null,
        scene: null,
        rabbitBitmap: null,
        screenText: null,

        // count
        COUNT: null,

        // input
        KEYS: null,
        KEY_SPACE: 32,

        init: function() {
            this.KEYS = [];
            this.loadAssets();
            // play background audio
            this.background_audio.play();
            this.background_audio.loop = true;
            // set the count
            this.initCount();
            // keyboard events
            var self = this;
            document.onkeydown = function() { self.keyPressHandler.apply(self, arguments); };
            document.onkeyup   = function() { self.keyReleaseHandler.apply(self, arguments); };
        },

        loadAssets: function() {
            this.caerbannog        = new Image();
            var self               = this;
            this.caerbannog.src    = 'assets/images/rabbit_of_caerbannog.png';
            this.caerbannog.onload = function() { self.initDisplay.call(self); };
            this.background_audio  = new Audio('assets/audio/instructions.mp3');
            this.throw_audio       = new Audio('assets/audio/125.wav');
            this.worms_audio       = new Audio('assets/audio/holy_hand_grenade.mp3');
            this.explosion_audio   = new Audio('assets/audio/explosion.mp3');
            // set play events
            this.throw_audio.addEventListener('ended', function(e) { self.worms_audio.play(); });
            this.worms_audio.addEventListener('ended', function(e) { self.explosion_audio.play(); });
        },

        initDisplay: function() {
            // create canvas stage
            this.stage          = new createjs.Stage("demoCanvas");
            this.canvasElm      = document.getElementById("demoCanvas");
            this.scene          = this.stage.addChild( new createjs.Container() );
            this.rabbitBitmap   = this.scene.addChild( new createjs.Bitmap(this.caerbannog) );
            var bounds          = this.rabbitBitmap.getBounds();
            this.rabbitBitmap.x -= bounds.width/2;
            this.rabbitBitmap.y -= bounds.height/2;
            // init display text
            this.screenText = this.scene.addChild( new createjs.Text( "", "bold 95px holy", "red" ) );
            this.screenText.visible = false;
            // create main loop
            var self = this;
            createjs.Ticker.addEventListener("tick", function() { self.app_tick.apply(self, arguments); });
            window.onresize = function() { self.resize.apply(self, arguments); };
            this.resize();
        },

        initCount: function() {
            this.COUNT = [ 'One', 'Two', 'Five!', 'Three Sir!', 'Three!' ];
        },

        startCount: function()
        {
            // switch audio and reset
            this.background_audio.pause();
            this.throw_audio.pause();
            this.worms_audio.pause();
            this.explosion_audio.pause();
            this.background_audio.currentTime =
            this.throw_audio.currentTime      =
            this.worms_audio.currentTime      =
            this.explosion_audio.currentTime  = 0;
            // start playback
            this.throw_audio.play();
            // display timed text
            this.initCount();
            this.animateText();
        },

        animateText: function() {
            this.displayMessage(this.COUNT.shift());
        },

        displayMessage: function(msg) {
            var self = this;
            this.screenText.text = msg;
            this.screenText.visible = true;
            this.screenText.x = -this.screenText.getMeasuredWidth()/2;
            this.screenText.y = -this.screenText.getMeasuredHeight();
            this.screenText.alpha = 0;
            createjs.Tween.get( this.screenText, {override:true} )
                          .to(  {   y:-50,
                                    alpha:1 },
                                500,
                                createjs.Ease.bounceOut )
                          .wait( 200 )
                          .to(  {   y:-50,
                                    alpha:0,
                                    visible:false },
                                100,
                                createjs.Ease.none )
                          .call( function() { self.animateText.call(self); } );
        },

        app_tick: function(e) {
            this.stage.update(e);
        },

        resize: function(e) {
            this.canvasElm.width = window.innerWidth;
            this.canvasElm.height = window.innerHeight;
            this.stage.x = this.canvasElm.width/2;
            this.stage.y = this.canvasElm.height/2;
        },

        keyPressHandler: function( e ) {
            var key_code = ( window.event ) ? event.keyCode : e.keyCode;
            this.KEYS[key_code] = true;
            // do something with the keys
            this.processKeys();
        },

        keyReleaseHandler: function( e ) {
            var key_code = ( window.event ) ? event.keyCode : e.keyCode;
            this.KEYS[key_code] = false;
        },

        processKeys: function() {
            if( this.KEYS[this.KEY_SPACE] ) {
                this.startCount();
            }
        }
    };

    window.Controller = Controller;

}());