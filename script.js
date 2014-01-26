(function() {
    
    "use strict";
    
    var Player,
        player;
        
    // Private constructor

    Player = function(options) {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.canvasContext = this.canvas.getContext('2d');
        this.frameRate = 20;
        this.pixelSize = 1;
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

    	if(video.paused || video.ended)	{
            return false;
        }
        
        canvas.width = self.canvasWidth = Math.floor(canvas.clientWidth / self.pixelSize);
        canvas.height = self.canvasHeight = Math.floor(canvas.clientHeight / self.pixelSize);
        
    	context.drawImage(video,0,0,w,h);
    	setTimeout(Player.draw,self.frameRate,self, video);

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
        },
        decreasePixelSize: function() {
            if (this.pixelSize > 1) {
                this.pixelSize -= 10;
            }
        },


    }
    
    Player.initEventListeners();
            
}());