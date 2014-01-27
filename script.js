(function(document) {
    
    var Player,
        player;
        
    /*
     * Private constructor
     */
    
    Player = function(options) {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.canvasContext = this.canvas.getContext('2d');
        this.frameRate = 20;
        this.pixelSize = 1;
        this.currentEffect = undefined;
        Player.init(this);
    }
    
    /*
     * Private static methods
     */
    
    // Initialization    
    
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

    // Main draw function
    
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

    	setTimeout(Player.draw,self.frameRate,self,video);

    }
    
    // Effects
    
    Player.effects = {
        
        // Grayscale
        grayscale: function(self) {
            var tc = document.createElement('canvas'),
                bc = tc.getContext("2d"),
                v = self.video,
                w = tc.width = self.canvasWidth,
                h = tc.height = self.canvasHeight,
                c = self.canvasContext,
                idata,
                data,
                i,
                r,
                h,
                b,
                brightness;
                
            // First, draw it into the backing canvas
            bc.drawImage(v,0,0,w,h);

            // Grab the pixel data from the backing canvas
            idata = bc.getImageData(0,0,w,h);
            data = idata.data;

            // Loop through the pixels, turning them grayscale
            for(i = data.length; i-=4;) {
                r = data[i];
                g = data[i+1];
                b = data[i+2];
                brightness = (3*r+4*g+b)>>>3;
                data[i] = brightness;
                data[i+1] = brightness;
                data[i+2] = brightness;
            }
            idata.data = data;
            // Draw the pixels onto the visible canvas
            c.putImageData(idata,0,0);
        },
        
        // Sepia
        sepia: function(self) {
            var tc = document.createElement('canvas'),
                bc = tc.getContext("2d"),
                v = self.video,
                w = tc.width = self.canvasWidth,
                h = tc.height = self.canvasHeight,
                c = self.canvasContext,
                idata,
                data,
                i,
                h,
                r = _sepia.r,
                g = _sepia.g,
                b = _sepia.b,
                noise,
                iPN,
                j;
                
            // First, draw it into the backing canvas
            bc.drawImage(v,0,0,w,h);

            // Grab the pixel data from the backing canvas
            idata = bc.getImageData(0,0,w,h);
            data = idata.data;

            // Loop through the pixels, turning them grayscale
            for (i=data.length; i-=4;) {
             
                // change image colors
                data[i] = r[data[i]];
                data[i+1] = g[data[i+1]];
                data[i+2] = b[data[i+2]];

            }

            idata.data = data;
            // Draw the pixels onto the visible canvas
            c.putImageData(idata,0,0);
        },

        // Experimental
        experimental: function(self) {
            var tc = document.createElement('canvas'),
                bc = tc.getContext("2d"),
                v = self.video,
                w = tc.width = self.canvasWidth,
                h = tc.height = self.canvasHeight,
                c = self.canvasContext,
                idata,
                data,
                i,
                r,
                h,
                b,
                brightness;
                
            // First, draw it into the backing canvas
            bc.drawImage(v,0,0,w,h);

            // Grab the pixel data from the backing canvas
            idata = bc.getImageData(0,0,w,h);
            data = idata.data;

            // Loop through the pixels, turning them grayscale
            for(i = data.length; i-=4;) {

                  // red
                  data[i] = 255 - data[i];
                  // green
                  data[i + 1] = 255 - data[i + 1];
                  // blue
                  data[i + 2] = 255 - data[i + 2];

            }
            idata.data = data;
            // Draw the pixels onto the visible canvas
            c.putImageData(idata,0,0);
        },
                
        // Invert
        invert: function(self) {
            var tc = document.createElement('canvas'),
                bc = tc.getContext("2d"),
                v = self.video,
                w = tc.width = self.canvasWidth,
                h = tc.height = self.canvasHeight,
                c = self.canvasContext,
                idata,
                data,
                i,
                r,
                h,
                b,
                brightness;
                
            // First, draw it into the backing canvas
            bc.drawImage(v,0,0,w,h);

            // Grab the pixel data from the backing canvas
            idata = bc.getImageData(0,0,w,h);
            data = idata.data;

            // Loop through the pixels, turning them grayscale
            for(i = data.length; i-=4;) {

                  // red
                  data[i] = 255 - data[i];
                  // green
                  data[i + 1] = 255 - data[i + 1];
                  // blue
                  data[i + 2] = 255 - data[i + 2];

            }
            idata.data = data;
            // Draw the pixels onto the visible canvas
            c.putImageData(idata,0,0);
        },
                
    }
    
    Player.transform = function(self, transform) {
        var className = self.canvas.className;
        if (className.indexOf(transform) === -1) {
            self.canvas.setAttribute("class", className + " " + transform);    
        } else {
            self.canvas.setAttribute("class", className.replace(" " + transform, ""));    
        }
    }
    
    // Update canvas size
    
    Player.updateCanvasSize = function(self) {
        var canvas = self.canvas;
        canvas.width = self.canvasWidth = Math.floor(canvas.clientWidth / self.pixelSize);
        canvas.height = self.canvasHeight = Math.floor(canvas.clientHeight / self.pixelSize);
    }

    // Event listeners nitialization    
    
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

               // C: transform: circle
               case 99:
                   player.setTransform("circle");
                   break;

               // V: transform: flip vertical
               case 118:
                   player.setTransform("flipv");
                   break;

               // E: effect: experimental
               case 101:
                   player.setEffect("experimental");
                   break;

               // S: effect: sepia
               case 115:
                   player.setEffect("sepia");
                   break;

               // I: effect: invert
               case 105:
                   player.setEffect("invert");
                   break;

               default:
                   console.log(key)
           }
        });
    }
    
    /*
     * Public prototype
     */
    
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
                player.currentEffect = effect;
            } else {
                player.currentEffect = undefined;
            }
        },
        
        setTransform: function(transform) {
            Player.transform(this, transform);
        }


    }
    
    // Initialize listeners
    
    Player.initEventListeners();

    // Private
    
    var _sepia = {
        r: [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 44, 45, 47, 48, 49, 52, 54, 55, 57, 59, 60, 62, 65, 67, 69, 70, 72, 74, 77, 79, 81, 83, 86, 88, 90, 92, 94, 97, 99, 101, 103, 107, 109, 111, 112, 116, 118, 120, 124, 126, 127, 129, 133, 135, 136, 140, 142, 143, 145, 149, 150, 152, 155, 157, 159, 162, 163, 165, 167, 170, 171, 173, 176, 177, 178, 180, 183, 184, 185, 188, 189, 190, 192, 194, 195, 196, 198, 200, 201, 202, 203, 204, 206, 207, 208, 209, 211, 212, 213, 214, 215, 216, 218, 219, 219, 220, 221, 222, 223, 224, 225, 226, 227, 227, 228, 229, 229, 230, 231, 232, 232, 233, 234, 234, 235, 236, 236, 237, 238, 238, 239, 239, 240, 241, 241, 242, 242, 243, 244, 244, 245, 245, 245, 246, 247, 247, 248, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
        g: [0, 0, 1, 2, 2, 3, 5, 5, 6, 7, 8, 8, 10, 11, 11, 12, 13, 15, 15, 16, 17, 18, 18, 19, 21, 22, 22, 23, 24, 26, 26, 27, 28, 29, 31, 31, 32, 33, 34, 35, 35, 37, 38, 39, 40, 41, 43, 44, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 83, 84, 85, 86, 88, 89, 90, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 105, 106, 107, 108, 109, 111, 113, 114, 115, 117, 118, 119, 120, 122, 123, 124, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137, 138, 140, 141, 142, 144, 145, 146, 148, 149, 150, 151, 153, 154, 155, 157, 158, 159, 160, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174, 175, 176, 177, 178, 179, 181, 182, 183, 184, 186, 186, 187, 188, 189, 190, 192, 193, 194, 195, 195, 196, 197, 199, 200, 201, 202, 202, 203, 204, 205, 206, 207, 208, 208, 209, 210, 211, 212, 213, 214, 214, 215, 216, 217, 218, 219, 219, 220, 221, 222, 223, 223, 224, 225, 226, 226, 227, 228, 228, 229, 230, 231, 232, 232, 232, 233, 234, 235, 235, 236, 236, 237, 238, 238, 239, 239, 240, 240, 241, 242, 242, 242, 243, 244, 245, 245, 246, 246, 247, 247, 248, 249, 249, 249, 250, 251, 251, 252, 252, 252, 253, 254, 255],
        b: [53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 57, 57, 57, 58, 58, 58, 59, 59, 59]
    }
    
            
}(window.document));