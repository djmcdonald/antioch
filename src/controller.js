(function() {

    var Controller = function(counter) {
        this.counter = counter;
        this.init();
    };

    Controller.prototype = {
        // audio
        background_audio: null,
        throw_audio: null,
        worms_audio: null,
        explosion_audio: null,
        // image
        caerbannog: null,
        grenade_of_antioch: null,

        // display objects
        stage: null,
        canvasElm: null,
        scene: null,
        rabbitBitmap: null,
        screenText: null,
        grenade: null,
        explosionSpriteSheet: null,
        explosion: null,

        // count
        //COUNT: null,
        counter: null,

        // input
        KEYS: null,
        KEY_SPACE: 32,

        init: function() {
            this.KEYS = [];
            this.loadAssets();
            // play background audio
            this.background_audio.play();
            this.background_audio.loop = true;
            // keyboard events
            var self = this;
            document.onkeydown = function() { self.keyPressHandler.apply(self, arguments); };
            document.onkeyup   = function() { self.keyReleaseHandler.apply(self, arguments); };
        },

        loadAssets: function() {
            this.caerbannog         = new Image();
            this.grenade_of_antioch = new Image();
            var self                = this;
            this.caerbannog.src     = 'assets/images/rabbit_of_caerbannog.png';
            this.caerbannog.onload  = function() {  self.grenade_of_antioch.src = 'assets/images/holy_hand_grenade.png';
                                                    self.grenade_of_antioch.onload  = function() { self.initDisplay.call(self); }; };
            this.background_audio   = new Audio('assets/audio/instructions.mp3');
            this.throw_audio        = new Audio('assets/audio/125.wav');
            this.worms_audio        = new Audio('assets/audio/holy_hand_grenade.mp3');
            this.explosion_audio    = new Audio('assets/audio/explosion.mp3');
            // set play events
            this.throw_audio.addEventListener('ended', function(e) { self.worms_audio.play(); });
            this.worms_audio.addEventListener('ended', function(e) { self.explosion_audio.play(); });
        },

        initDisplay: function() {
            // create canvas stage
            this.stage           = new createjs.Stage("demoCanvas");
            this.canvasElm       = document.getElementById("demoCanvas");
            this.scene           = this.stage.addChild( new createjs.Container() );
            // rabbit
            this.rabbitBitmap    = this.scene.addChild( new createjs.Bitmap(this.caerbannog) );
            var bounds           = this.rabbitBitmap.getBounds();
            this.rabbitBitmap.x  -= bounds.width/2;
            this.rabbitBitmap.y  -= bounds.height/2;
            // grenade
            this.grenade         = this.scene.addChild( new createjs.Bitmap(this.grenade_of_antioch) );
            bounds               = this.grenade.getBounds();
            this.grenade.regX    += bounds.width/2;
            this.grenade.regY    += (bounds.height/6)*4;
            this.grenade.visible = false;
            // explosion
            this.explosionSpriteSheet = new createjs.SpriteSheet({ images: ['assets/images/explosion_opaque.png'], frames: {width:64, height:64}, animations: {default:[0,24,false]} });
            this.explosion            = this.scene.addChild( new createjs.Sprite(this.explosionSpriteSheet) );
            this.explosion.regX       += 32;
            this.explosion.regY       += 32;
            this.explosion.scaleX     = this.explosion.scaleY = 8;
            this.explosion.x          = 250;
            this.explosion.visible    = false;
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
            this.counter.reset();
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
            // remove all text animations
            createjs.Tween.removeTweens(this.screenText);
            this.animateText();
            this.explosion.visible = false;
            this.animateGrenade();
        },

        animateText: function() {
            this.displayMessage(this.counter.count());
        },

        animateGrenade: function() {
            var self = this;
            this.grenade.x = 200;
            this.grenade.y = -this.canvasElm.height;
            this.grenade.rotation = 0;
            this.grenade.visible = true;
            createjs.Tween.get( this.grenade, {override:false} )
                          .wait( 4000 )
                          .to(  {   y: 100 },
                                1000,
                                createjs.Ease.bounceOut )
                          .wait( 200 )
                          .to(  {   x: 250,
                                    rotation: 20 },
                                250,
                                createjs.Ease.sineOut )
                          .call( function() { self.animateExplosion.call(self); } );
        },

        animateExplosion: function() {
            this.explosion.visible = true;
            this.explosion.gotoAndPlay(0);
        },

        displayMessage: function(msg) {
            var self = this;
            this.screenText.text = msg;
            this.screenText.visible = true;
            this.screenText.x = -this.screenText.getMeasuredWidth()/2;
            this.screenText.y = -this.screenText.getMeasuredHeight();
            this.screenText.alpha = 0;
            createjs.Tween.get( this.screenText, {override:false} )
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