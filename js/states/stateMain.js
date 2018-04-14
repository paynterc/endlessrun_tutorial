// StateMain is an object literal. Javascript object syntax is like this: { key: value, otherKey: otherValue };
// Here, the functions are properties of the object, so the syntax is a little different from other function declarations.
// We use myFunction: function() instead of function myFunction()
var StateMain = {
    preload: function() {
        
        game.load.image("ground", "images/main/ground.png");
        //game.load.image("hero", "images/main/hero.png");
        game.load.spritesheet("hero", 'images/main/hero_anim.png', 32, 32);
        game.load.spritesheet("bolt", "images/main/Bolt.png", 128, 64);
        game.load.spritesheet("firebolt", "images/main/firebolt.png", 128, 64);
        game.load.spritesheet("gem", "images/main/Gem2.png",32,32);
        game.load.spritesheet("boss1", "images/main/boss1.png",320,320);
        game.load.spritesheet("flopper", "images/main/flopper.png",32,32);
        game.load.spritesheet("fireball", "images/main/fireball.png",64,64);

        game.load.image("bar", "images/main/powerbar.png");
        game.load.image("block", "images/main/Rocck.png");
        game.load.image("missile", "images/main/missile.png");
        game.load.image("shard", "images/main/Shard.png");
        game.load.image("powerup", "images/main/PowerUp.png");

        game.load.audio("jump", "audio/sfx/jump.wav");
        game.load.audio("land", "audio/sfx/land.wav");
        game.load.audio("die", "audio/sfx/die.wav");
        game.load.audio("kick", "audio/sfx/Laser_Shoot5.wav");
        game.load.audio("explosion", "audio/sfx/Explosion5.wav");
        game.load.audio("pwrup", "audio/sfx/Powerup7.wav");

        game.load.image("bg0", "images/main/bg0.png");
        game.load.image("bg1", "images/main/bg1.png");
        game.load.image("bg2", "images/main/bg2.png");

        game.load.image("enemy1", "images/main/enemy1.png");

    
    },
    create: function() {
        // Keep this line
        // to tell the game what state we are in!
        model.state = "main";

        this.boss1Started = false;

        mediaManager.setBackgroundMusic("backgroundMusic");
        var soundButtons = new SoundButtons();


        // Variables to contain the player height and width.
		this.pheight = 32;
		this.pwidth = 32;

        this.score=0;
        this.scoreText = game.add.text(game.width * .50, 32, '0', { fontSize: '64px', fill: '#FFFFFF' });

        this.helpText = game.add.text(16, game.height-30, "Hold Left Mouse to jump. Press 'E' to kick", { fontSize: '24px', fill: '#FFFFFF' });

        // I'm just putting this here to demonstrate how you can access state variables when in other classes.
        this.myvar = "HEYTHERE";
        
        // A variable to contain jump power.
        this.power = 0;



        // Add your background images first! Images appear in the order you added them, back to front.
    	// Create a tilesprite (x, y, width, height, key)
    	this.bg0 = this.game.add.tileSprite(0,
			game.height - this.game.cache.getImage('bg0').height + 114,
			game.width,
			game.cache.getImage('bg0').height,
			'bg0'
		);


    	this.bg1 = this.game.add.tileSprite(0,
			game.height - this.game.cache.getImage('bg1').height + 114,
			game.width,
			game.cache.getImage('bg1').height,
			'bg1'
		);
		
		this.bg2 = this.game.add.tileSprite(0,
			game.height - this.game.cache.getImage('bg2').height +114,
			game.width,
			game.cache.getImage('bg2').height,
			'bg2'
		);
        
        // Add the ground and the hero to the game stage.
        //this.ground = game.add.sprite(0, game.height -32, "ground");
        this.ground = new Phaser.Sprite(game, 0, game.height - 32, "ground", 0);
    	game.add.existing(this.ground);

        this.bolt = new Phaser.Sprite(game, 0, 0, "bolt", 0);
        this.bolt.animations.add('play',this.makeArray(0,5),24,true);
        game.add.existing(this.bolt);

        this.fireball = new Phaser.Sprite(game, 0, 0, "fireball", 0);
        this.fireball.animations.add('play',this.makeArray(0,4),12,true);
        this.fireball.animations.play('play');
        game.add.existing(this.fireball);

        // Hero is its own class now. See Hero.js.
		this.hero = new Hero(game.width * .2, this.ground.y - this.pheight);
        this.heroXstart = this.hero.x;
		
		// Add the power bar at the top of the hero graphic. Add this code AFTER the this.hero line
		this.powerBar = game.add.sprite(this.hero.x, this.hero.y-20, "bar");

		// Set the powerbar width to zero. We won't be able to see it, but it's there!
		this.powerBar.width = 0;



        // Turn the background sky blue.
		game.stage.backgroundColor="#00ffff"; 
		
		// Add a listener for mouse down input.
		game.input.onDown.add(this.mouseDown, this);

        var kickKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        kickKey.onDown.add(this.kickButton, this);

        // Start the physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Enable the physics on the ground.
		game.physics.enable(this.ground, Phaser.Physics.ARCADE);
        this.ground.body.friction.x=0;
		this.ground.body.immovable = true;
		
		
        this.enemies = game.add.group();
        //this.makeEnemies();
		
		// Add blocks
		this.blocks = game.add.group();
        this.makeBlocks(); // Now write the makeBlocks function.
		


		// Use this to prevent clicking when game is over.
		this.clickLock = false;

		this.jumpSound = game.add.audio('jump',.25);
		this.landSound = game.add.audio('land',.25);
        this.dieSound = game.add.audio('die',.25);
        this.kickSound = game.add.audio('kick',.25);
        this.explodeSound = game.add.audio('explosion',.25);
        this.powerupSound = game.add.audio('pwrup',.25);

// 		this.jumpSound.volume = 0.25;
// 		this.landSound.volume = 0.25;
// 		this.dieSound.volume = 0.25;
		
		// Keep track of if the player is on the ground so we only play the landing sound once
		this.hero.landed=true;

        this.bgv0=0.3;
        this.bgv1=0.5;
        this.bgv2=0.75;


        // Create blocks on a timer.
        this.blocksGo();

        this.powerUpTimer = game.time.events.loop(Phaser.Timer.SECOND * 10, this.makePowerUp, this);

        var bossKey = game.input.keyboard.addKey(Phaser.Keyboard.B);
        bossKey.onDown.add(this.boss1Go, this);

        this.helpText.bringToTop();

    },
    blocksGo: function() {

        this.blockTimer = game.time.events.loop(Phaser.Timer.SECOND * 5, this.makeBlocks, this);

    },
    boss1Go: function() {

        this.boss1Started = true;

        mediaManager.restartMusic("bossMusic");
        mediaManager.setBackgroundMusicFadeIn("bossMusic");
        this.boss1 = game.add.sprite(game.width/2 - (320/2),250, "boss1");
        this.boss1.animations.add('wave',this.makeArray(0,4),12,true);
        this.boss1.animations.play('wave');
        this.boss1.sendToBack();

        game.add.existing(this.boss1);

        this.tweenBackground(0x00ffff,0xf44242,2000);
        game.add.tween(this.boss1).to( { y: -32 }, 2000, Phaser.Easing.Linear.None, true);

        game.time.events.remove(this.blockTimer);
        this.rainTimer = game.time.events.loop(Phaser.Timer.SECOND * .5, this.makeRain, this);
        this.boss1StopTimer = game.time.events.add(Phaser.Timer.SECOND * 20, this.boss1Stop, this);


    },
    boss1Stop: function() {
        mediaManager.setBackgroundMusicFadeIn("backgroundMusic");

        game.time.events.remove(this.boss1StopTimer);


        game.add.existing(this.boss1);

        this.tweenBackground(0xf44242,0x00ffff,2000);
        game.add.tween(this.boss1).to( { y: 250 }, 2000, Phaser.Easing.Linear.None, true);

        game.time.events.remove(this.rainTimer);

        this.blocksGo();
    },
    update: function() {

        if(this.hero.onfire && !this.hero.kicking){
            this.fireball.x= (this.hero.x + this.hero.width/2) - this.fireball.width/2;
            this.fireball.y=this.hero.y - this.fireball.width *.5;
        }else{
            this.fireball.x=-100;
            this.fireball.y=-100;
        }


        if(this.hero.x < this.heroXstart){
            this.hero.body.velocity.x = 0;
            this.hero.x = this.heroXstart;
        }


        if(this.hero.kicking){
            this.bolt.x=this.hero.x-64;
            this.bolt.y=this.hero.y-16;
        }else{
            this.bolt.x=-100;
            this.bolt.y=-100;
        }
    
    	// Allow collisions between hero and ground.
        game.physics.arcade.collide(this.hero, this.ground, this.onGround, null, this);
		
		// Collide the hero with the blocks.
        game.physics.arcade.collide(this.hero, this.blocks, function(obj1,obj2){ this.collisionHandler(obj1,obj2); }, null, this);

        // Allow collisions between enemy and ground.
        game.physics.arcade.collide(this.enemy, this.ground);
        
        game.physics.arcade.collide(this.hero, this.enemy, this.delayOver, null, this);

        game.physics.arcade.collide(this.blocks, this.ground);


/***
    	for(let i=0; i<this.enemies.children.length;i++){
    		let fchild = this.enemies.children[i];
			if (fchild.x < 0 - fchild.width) {
			    //  Add and update the score
				this.score += 10;
				this.scoreText.text = this.score;
			
				fchild.destroy();
				this.enemies.remove(fchild);
			}
    	}
***/

        for(var i=0; i<this.blocks.children.length;i++){
            var fchild = this.blocks.children[i];
            // The block is part of a group, so the x value is relative the to group x value. I placed the group at 0,0 so this should be irrelevant now.
            if (fchild.x < 0 - fchild.width || fchild.y>game.height) {
                fchild.destroy();
                this.blocks.remove(fchild);
            }
        }

        
        this.bg0.tilePosition.x -= this.bgv0;
        this.bg1.tilePosition.x -= this.bgv1;
        this.bg2.tilePosition.x -= this.bgv2;

        this.powerBar.y = this.hero.y -20;
        this.powerBar.x = this.hero.x -20;


    },
    kickButton: function() {
        if (this.clickLock === true) {
            return;
        }
        this.kickSound.play();
        this.bolt.animations.play('play');
        this.hero.doKick();
    },
    mouseDown: function() {
    
    	if (this.clickLock === true) {
            return;
        }
    
		// If we're not on the ground, no jumping
		if (!this.hero.landed) {
			return;
		}

 		// Stop listening for mouse down for now
    	game.input.onDown.remove(this.mouseDown, this);
        
        // This timer runs 1000 times a second. This will give us a smooth power bar effect.
        this.timer = game.time.events.loop(Phaser.Timer.SECOND / 1000, this.increasePower, this);

		// Start listening for mouse up.
        game.input.onUp.add(this.mouseUp, this);
        
    },
    increasePower: function() {
    	var maxPower = 100;

        this.power++;
        this.powerBar.width = 128 *  (this.power/maxPower);
        if (this.power > maxPower) {
            this.power = maxPower;
        }else{

        	this.jumpSound.play();
        	// Creates a rising pitch effect. You have to play the sound first. See above.
			this.jumpSound._sound.playbackRate.value = this.power/maxPower;

        }
    },
    mouseUp:function() {

	   	// Stop listening for mouse up for now.
	    game.input.onUp.remove(this.mouseUp, this);
        this.hero.animations.play('jump');

	    // Call our jump function
	    this.hero.doJump(this.power);
	    
	    // Destroy the timer
        game.time.events.remove(this.timer);
        
        // Reset power
        this.power = 0;
        this.powerBar.width = 0;
        
        // Start listening for mouse down again.
		game.input.onDown.add(this.mouseDown, this);
	   
	},
	onGround: function() {
        if (this.clickLock === true) {
            return;
        }

        if (this.hero)
        {
        	if(!this.hero.landed){
        		this.hero.landed=true;
        		this.landSound.play();
        	}
            if(this.hero.x>this.heroXstart){
                this.hero.body.velocity.x=-128;
            }
            this.hero.animations.play('run');
        }        
    },
	makeBlocks: function() {
	
		// Remove all the blocks from the group. You don't want to fill up memory.
        //this.blocks.removeAll();
	
		var bStartX=game.width, bStartY=game.height-32-64;
        var rndPos, block;
        var offset = game.rnd.integerInRange(0,8);

        block = new Block( bStartX + (offset * 64), bStartY - ( 6 * 64 ) );
        this.blocks.add(block);

        offset = game.rnd.integerInRange(0,8);
        block = new Block( bStartX + (offset * 64), bStartY );
        this.blocks.add(block);

        var wallHeight=game.rnd.integerInRange(2, 4);
        for (var i = 0; i < wallHeight; i++) {
        	rndPos = game.rnd.integerInRange(0,7);
            offset = game.rnd.integerInRange(0,4);

            block = new Block( bStartX + (offset * 64), bStartY - ( rndPos * 64 ) );

            this.blocks.add(block);
        }

        
        //this.makeEnemies();
    },
    makeRain: function() {
        var xx,yy,drop;


        var dropCount=game.rnd.integerInRange(1, 2);
        for (var i = 0; i < dropCount; i++) {
            xx=game.rnd.integerInRange(0,game.width-32);
            yy=0-64;
            drop = new Rain( xx, yy );
            this.blocks.add(drop);
        }
    },
    makePowerUp: function() {
        var powerup = new PowerUp( game.width+64, -64 );
        this.blocks.add(powerup);
    },
    makeEnemies: function() {
    		
    		
    		console.log('enemies',this.enemies.length);	
    		if(this.enemies.length>2){
    			return;
    		}
    		var r = game.rnd.integerInRange(0, 3);
    		var xr;
    		for (var i = 0; i < r; i++) {
    			xr = game.rnd.integerInRange(game.width/3, game.width);
    		    this.enemy = new Enemy(xr, 0);
    		}

    },
    collisionHandler: function(hero,block) {
        // If the hero has collided with the front of the block, end the game.

        if (block.type == "gem") {
            block.destroy();
            this.blocks.remove(block);
            this.powerupSound.play();
            this.updateScore(10);
            return true;

        } else if(block.type=="powerup"){

            block.destroy();
            this.blocks.remove(block);
            this.setFire();

        }else if(block.type=="rain"){
            this.delayOver();
        }else if(hero.x + hero.width <= block.x){
            // Standard block. Only die if you hit the front of it.
            if( this.hero.onfire ){
                this.explodeSound.play();
                this.updateScore(15);
                block.destroy();
                this.blocks.remove(block);
            }else{
                this.delayOver();
            }
    	}else{
            this.onGround();
        }
    	return true;
    },
    updateScore: function(points){
        this.score += points;
        this.scoreText.text = this.score;
        if(this.score > 100 && !this.boss1Started){
            this.boss1Go();
        }

    },
    setFire: function(){

        this.helpText.setText("You can break blocks when on fire.");
        game.time.events.remove(this.fireTimer);

        this.hero.onfire=true;
        this.bolt.loadTexture("firebolt");
        this.powerupSound.play();

        this.fireTimer =  game.time.events.add(Phaser.Timer.SECOND * 10, this.offFire, this);

    },
    offFire: function(){
        game.time.events.remove(this.fireTimer);
        this.hero.onfire=false;
        this.bolt.loadTexture("bolt");
    },
    delayOver: function() {
    	if(this.clickLock){
    		return;
    	}
        this.clickLock = true;
        console.log("OVER");

        for(var i=0; i<this.blocks.children.length;i++){
            var fchild = this.blocks.children[i];
            fchild.body.velocity.x = fchild.body.velocity.y = 0;
        }

        this.bgv0 = this.bgv1 = this.bgv2=0;
        this.hero.body.velocity.x = this.hero.body.velocity.y = 0;
    	this.dieSound.play();
        this.clickLock = true;
        this.hero.animations.play('die');
        game.time.events.add(Phaser.Timer.SECOND, this.gameOver, this);
    },
    gameOver: function() {
        game.state.start("StateOver");
    },
    render: function(){
        game.debug.text("Power: "  + this.power.toString(), 32, 32);

    },
    makeArray: function(start,end) {
        var myArray=[];
        for (var i = start; i < end; i++) {
            myArray.push(i);
        }
        return myArray;
    },
    tweenBackground: function(startColor, endColor, time = 250, delay = 0, callback = null){
        // 0xf44242,0xffffff,2000,0,this.resetHeroColor
        // create a step object
        var colorBlend = {
            step: 0
        };

        // create a tween to increment that step from 0 to 100.
        var colorTween = game.add.tween(colorBlend).to({ step: 100 }, time, Phaser.Easing.Linear.None, delay);

        // add an anonoymous function with lexical scope to change the tint, calling Phaser.Colour.interpolateColor
        colorTween.onUpdateCallback(() => {
            game.stage.backgroundColor = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
        });

        // set object to the starting colour
        game.stage.backgroundColor=startColor;


        // if you passed a callback, add it to the tween on complete
        if (callback) {
            colorTween.onComplete.add(callback, this);
        }

        // finally, start the tween
        colorTween.start();
    }
}