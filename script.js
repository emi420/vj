(function() {
    
        "use strict";
        
        var Player,
            player;

        Player = function(options) {
            this.video = document.getElementById('video');
            this.canvas = document.getElementById('canvas');
            Player.init(this);
        }
        
        Player.init = function(self) {
            var video = self.video,
                canvas = self.canvas,
                context,
                cw,
                ch;

        	context = canvas.getContext('2d');
        	cw = Math.floor(canvas.clientWidth / 100);
        	ch = Math.floor(canvas.clientHeight / 100);
        	canvas.width = cw;
        	canvas.height = ch;
 
        	video.addEventListener('play', function(){
        		Player.draw(this,context,cw,ch);
        	},false);
        }
        
        Player.draw = function(video,canvas,w,h) {
        	if(video.paused || video.ended)	return false;
        	canvas.drawImage(video,0,0,w,h);
        	setTimeout(Player.draw,20,video,canvas,w,h);
        }
        
        Player.initEventListeners = function() {
            
            document.addEventListener('DOMContentLoaded', function() {
                player = new Player();
            },false);
        
            document.addEventListener("keypress", function(e) {
               var key = e.charCode; 
           
               switch(key) {
                   case 32:
                       if (player.playing === false) {
                           player.play();
                       } else {
                           player.pause();                           
                       }
                       break;
               }
            });
        }
        
        Player.prototype = {

            playing: false,

            play: function() {
                this.video.play();
                player.playing = true;
            },

            pause: function() {
                this.video.pause();
                player.playing = false;
            }
        }
        
        Player.initEventListeners();
            
    }());