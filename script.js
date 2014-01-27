(function() {
    
    //"use strict";
    
    var Player,
        player;
        
    // Private constructor

    Player = function(options) {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.canvasContext = this.canvas.getContext('2d');
        this.frameRate = 20;
        this.pixelSize = 1;
        this.currentEffect = undefined;
        Player.init(this);
    }
    
    // Private static methods
    
    Player.init = function(self) {
        var video = self.video,
            canvas = self.canvas,
            context = self.canvasContext;
            
        canvas.width = self.canvasWidth = Math.floor(canvas.clientWidth / self.pixelSize);
        canvas.height = self.canvasHeight = Math.floor(canvas.clientHeight / self.pixelSize);

    	video.addEventListener('play', function(){
    		Player.draw(self, this);
    	},false);
    }
    
    Player.draw = function(self, video) {
        var w = self.canvasWidth,
            h = self.canvasHeight,
            context = self.canvasContext,
            canvas = self.canvas;

    	if (video.paused || video.ended) {
            return false;
        }
        
        if (self.currentEffect !== undefined) {
            Player.effects[self.currentEffect](self);
        } else {
        	context.drawImage(video,0,0,w,h);
        }

    	setTimeout(Player.draw,self.frameRate,self, video);

    }
    
    Player.effects = {
        grayscale: function(self) {
            var c = document.createElement('canvas'),
                bc = c.getContext("2d"),
                v = self.video,
                w = c.width = self.canvasWidth,
                h = c.height = self.canvasHeight,
                c = self.canvasContext;
            
            // First, draw it into the backing canvas
            bc.drawImage(v,0,0,w,h);

            // Grab the pixel data from the backing canvas
            var idata = bc.getImageData(0,0,w,h);
            var data = idata.data;

            // Loop through the pixels, turning them grayscale
            for(var i = 0; i < data.length; i+=4) {
                var r = data[i];
                var g = data[i+1];
                var b = data[i+2];
                var brightness = (3*r+4*g+b)>>>3;
                data[i] = brightness;
                data[i+1] = brightness;
                data[i+2] = brightness;
            }
            idata.data = data;
            // Draw the pixels onto the visible canvas
            c.putImageData(idata,0,0);
        }
    }
    
    Player.updateCanvasSize = function(self) {
        var canvas = self.canvas;
        canvas.width = self.canvasWidth = Math.floor(canvas.clientWidth / self.pixelSize);
        canvas.height = self.canvasHeight = Math.floor(canvas.clientHeight / self.pixelSize);
    }
    
    Player.initEventListeners = function() {
        
        // DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            player = new Player();
        },false);
    
        // keypress
        document.addEventListener("keypress", function(e) {
           var key = e.charCode; 
       
           console.log("keypress: " + key);
       
           switch(key) {
               // Spacebar: play/pause
               case 32:
                   if (player.playing === false) {
                       player.play();
                   } else {
                       player.pause();                           
                   }
                   break;

               // Q: increase framerate
               case 119:
                   player.increaseFrameRate();
                   break;

               // W: decrease framerate
               case 113:
                   player.decreaseFrameRate();
                   break;

               // P: increase pixel size
               case 112:
                   player.increasePixelSize();
                   break;

               // O: decrease pixel size
               case 111:
                   player.decreasePixelSize();
                   break;

               // G: effect: gray scale
               case 103:
                   player.setEffect("grayscale");
                   break;

               default:
                   alert(key)
           }
        });
    }
    
    // Public prototype
    
    Player.prototype = {

        playing: false,

        play: function() {
            this.video.play();
            this.playing = true;
        },

        pause: function() {
            this.video.pause();
            this.playing = false;
        },
        
        increaseFrameRate: function() {
            this.frameRate += 100;
        },
        
        decreaseFrameRate: function() {
            this.frameRate -= 100;
        },

        increasePixelSize: function() {
            if (this.pixelSize < 1000) {
                this.pixelSize += 10;
            }        
            Player.updateCanvasSize(this);    
        },
        
        decreasePixelSize: function() {
            if (this.pixelSize > 1) {
                this.pixelSize -= 10;
            }
            Player.updateCanvasSize(this);    
        },
        
        setEffect: function(effect) {
            if (player.currentEffect !== effect) {
                player.currentEffect = "grayscale";
            } else {
                player.currentEffect = undefined;
            }
        }


    }
    
    Player.initEventListeners();
            
}());