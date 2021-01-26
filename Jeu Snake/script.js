window.onload =function(){
    var canvaswidth = 900;
    var canvasheight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakey;
    var yummy;
    var widthInBlocks = canvaswidth/blockSize;
    var heightInBlocks = canvasheight/blockSize;
    var score;
    var highscore;
    var timeout;

    init();

    function init(){

        
        var canvas = document.createElement('canvas');
        canvas.width = canvaswidth;
        canvas.height = canvasheight;
        canvas.style.border ="30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display ="block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakey = new Snake([[6,4], [5,4], [4,4]], "right");
        yummy = new Apple([10,10]);
        score = 0;
        highscore = score;
        refreshCanvas(); 

    
    }

    function refreshCanvas() {
        snakey.advance();
        if(snakey.checkcollision()) {
            gameOver();
            
        }
        else {
            if(snakey.isEatingApple(yummy)){
                score++;
                while(score > highscore){
                    highscore = score;
                }
                snakey.ateApple = true;
                do
                {
                    yummy.setNewPosition();
                }
               while(yummy.isOnSnake(snakey))
            }
            ctx.clearRect(0,0,canvaswidth,canvasheight);
            drawScore();
            snakey.draw();
            yummy.draw();
            timeout = setTimeout(refreshCanvas,delay);
        }

    }
    function gameOver(){
        ctx.save();
        ctx.font = "bold 60px sans-serif";
        ctx.fillStyle ="white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        var centreX = canvaswidth / 2;
        var centreY = canvasheight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche espace pour rejouer!", centreX, centreY -120);
        ctx.fillText("Appuyer sur la touche espace pour rejouer!", centreX, centreY -120);
        ctx.restore();
    };


    function restart(){
        snakey = new Snake([[6,4], [5,4], [4,4]], "right");
        yummy = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }
    function drawScore(){
        ctx.save();
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.font = "bold 30px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Meilleur score = " + highscore.toString(), 150, 30);
        ctx.font = "bold 30px sans-serif";
        ctx.fillStyle ="blue";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvaswidth / 2;
        var centreY = canvasheight / 2;
        ctx.fillText("Score = " + score.toString(), centreX, centreY);
        ctx.restore();
    };
    function drawBlock(ctx, position){
        ctx.beginPath();
        var radius = blockSize/2;
        var x = position[0]*blockSize + radius;
        var y = position[1]*blockSize + radius;
        ctx.arc(x,y,radius, 0, Math.PI*2, true);
        ctx.fill();
    };
    function Snake(body,direction){
        this.body = body;
        this.direction = direction
        this.ateApple = false;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle="#ff0000";
            drawBlock(ctx,this.body[0]);
            ctx.fillStyle = "#ff8844";
            for(var i = 1; i < this.body.length; i++){
                drawBlock(ctx,this.body[i]);
            }
            ctx.restore();

        };
        this.advance= function(){
            var nextposition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextposition[0] -= 1;
                    break;
                case "right":
                    nextposition[0] += 1;
                    break;
                case "down":
                    nextposition[1] +=1;
                    break;
                case "up":
                    nextposition[1] -=1;
                break;
               default:
                   throw("Direction Invalide");
            }
            this.body.unshift(nextposition);
            if(!this.ateApple)
            this.body.pop();
            else
                this.ateApple= false;
        };
        this.setdirection =function(newdirection){
            var alloweddirections;
            switch(this.direction)
            {
                case "left":
                
                case "right":
                    alloweddirections = ["up", "down"];
                    break;
                case "down":
        
                case "up":
                  alloweddirections = ["left", "right" ];
                  break;
                  default:
                   throw("Direction Invalide");
            }
            if(alloweddirections.indexOf(newdirection) > -1){
                this.direction = newdirection;
            }
        };
        this.checkcollision =function(){
            var wallcollision = false;
            var snakecollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallcollision = true;
            }

            for(var i = 0; i< rest.length ; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakecollision = true;

                }
            }
            return wallcollision || snakecollision;


        };
        this.isEatingApple = function(appletoEat){
            var head = this.body[0];
            if(head[0] === appletoEat.position[0] && head[1] === appletoEat.position[1])
            {
                return true;
            }
            else
            {
                return false;

            }
        };

    }
        function Apple(position) {
            this.position = position;
            this.draw = function() {
                ctx.save();
                ctx.fillStyle = "#33cc33";
                ctx.beginPath();
                var radius = blockSize/2;
                var x = this.position[0]*blockSize + radius;
                var y = this.position[1]*blockSize + radius;
                ctx.arc(x,y, radius, 0, Math.PI*2, true);
                ctx.fill();
                ctx.restore();
            };
            this.setNewPosition = function() {
                var newX = Math.round(Math.random() * (widthInBlocks -1));
                var newY = Math.round(Math.random() * (heightInBlocks -1));
                this.position = [newX, newY];
            };
            this.isOnSnake = function(snaketocheck){
                var isOnSnake = false;

                for(var i = 0 ; i < snaketocheck.body.length; i++ ){
                    if(this.position[0] === snaketocheck.body[i][0] && this.position[1] === snaketocheck.body[i][1]) {
                        isOnSnake = true;
                    }
                }
                return isOnSnake;
            };
        }

    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newdirection;
        switch(key)
{
            case 37:
                newdirection ="left";
                break;
            case 38:
                newdirection ="up";
                break;
            case 39:
                newdirection ="right";
                break;
            case 40: newdirection ="down";
                break;
            case 32:
                restart();
                return;

                default:
                   return;

        }
        snakey.setdirection(newdirection);

    }

}
