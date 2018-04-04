// StateMain is an object literal. Javascript object syntax is like this: { key: value, otherKey: otherValue };
// Here, the functions are properties of the object, so the syntax is a little different from other function declarations.
// We use myFunction: function() instead of function myFunction()
var StateMain = {
    preload: function() {
        
        game.load.image("ground", "images/main/ground.png");
        //game.load.image("hero", "images/main/hero.png");
        game.load.spritesheet("hero", 'images/main/hero_anim.png', 32, 32);
        game.load.spritesheet("anmKick", "images/main/BoltKick.png", 128, 64);

        game.load.image("bar", "images/main/powerbar.png");
        game.load.image("block", "images/main/Rocck.png");
        game.load.image("missile", "images/main/missile.png");

        game.load.audio("jump", "audio/sfx/jump.wav");
        game.load.audio("land", "audio/sfx/land.wav");
        game.load.audio("die", "audio/sfx/die.wav");
        game.load.audio("kick", "audio/sfx/Laser_Shoot5.wav");

        game.load.image("bg0", "images/main/bg0.png");
        game.load.image("bg1", "images/main/bg1.png");
        game.load.image("bg2", "images/main/bg2.png");

        game.load.image("enemy1", "images/main/enemy1.png");

    
    },
    create: function() {
        // Keep this line
        // to tell the game what state we are in!
        model.state = "main";
        
		// Variables to contain the player height and width.
		this.pheight = 32;
		this.pwidth = 32;
        
        // I'm just putting this here to demonstrate how you can access state variables when in other classes.
        this.myvar = "HEYTHERE";
        
        // A variable to contain jump power.
        this.power = 0;

    	// Add your background images first! Images appear in the order you added them, back to front.    	
    	// Create a tilesprite (x, y, width, height, key)
    	this.bg0 = this.game.add.tileSprite(0,
			game.height - this.game.cache.getImage('bg0').height,
			game.width,
			game.cache.getImage('bg0').height,
			'bg0'
		);


    	this.bg1 = this.game.add.tileSprite(0,
			game.height - this.game.cache.getImage('bg1').height,
			game.width,
			game.cache.getImage('bg1').height,
			'bg1'
		);
		
		this.bg2 = this.game.add.tileSprite(0,
			game.height - this.game.cache.getImage('bg2').height,
			game.width,
			game.cache.getImage('bg2').height,
			'bg2'
		);
        
        // Add the ground and the hero to the game stage.
        //this.ground = game.add.sprite(0, game.height -32, "ground");
        this.ground = new Phaser.Sprite(game, 0, game.height - 32, "ground", 0);
    	game.add.existing(this.ground);


		// Hero is its own class now. See Hero.js.
		this.hero = new Hero(game.width * .2, this.ground.y - this.pheight);
        //this.hero.body.friction.x=0;
        this.heroXstart = this.hero.x;
		
		// Add the power bar at the top of the hero graphic. Add this code AFTER the this.hero line
		this.powerBar = game.add.sprite(this.hero.x, this.hero.y-20, "bar");

		// Set the powerbar width to zero. We won't be able to see it, but it's there!
		this.powerBar.width = 0;

        this.powerKick = game.add.sprite(-100, -100, "anmKick");
        this.powerKick.animations.add('fly',[0,1,2,3,4,5],48,false);
        game.physics.enable(this.powerKick, Phaser.Physics.ARCADE);


        // Turn the background sky blue.
		game.stage.backgroundColor="#00ffff"; 
		
		// Add a listener for mouse down input.
		game.input.onDown.add(this.mouseDown, this);

        var kickKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        kickKey.onDown.add(this.doKick, this);
        this.kicking=false;

        // Start the physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Enable the physics on the ground.
		game.physics.enable(this.ground, Phaser.Physics.ARCADE);
		
		
		//
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

// 		this.jumpSound.volume = 0.25;
// 		this.landSound.volume = 0.25;
// 		this.dieSound.volume = 0.25;


		
		// Keep track of if the player is on the ground so we only play the landing sound once
		this.hero.landed=true;

        this.bgv0=0.3;
        this.bgv1=0.5;
        this.bgv2=0.75;


        // Create blocks on a timer.
        this.timer = game.time.events.loop(Phaser.Timer.SECOND * 5, this.makeBlocks, this);

			
    },

    update: function() {

        if(this.hero.x<=this.heroXstart){
            this.hero.body.velocity.x = 0;
            this.hero.x=this.heroXstart;
        }
    
    	// Allow collisions between hero and ground.
        game.physics.arcade.collide(this.hero, this.ground, this.onGround, null, this);
		
		// Collide the hero with the blocks.
        game.physics.arcade.collide(this.hero, this.blocks, function(obj1,obj2){ this.collisionHandler(obj1,obj2); }, null, this);

        // Allow collisions between enemy and ground.
        game.physics.arcade.collide(this.enemy, this.ground);
        
        game.physics.arcade.collide(this.hero, this.enemy, this.delayOver, null, this);

        game.physics.arcade.collide(this.powerKick, this.blocks, function(obj1,obj2){ this.kickCollisionHandler(obj1,obj2); }, null, this);

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
            if (fchild.x < 0 - fchild.width) {
                //  Add and update the score
                //this.score += 10;
                //this.scoreText.text = this.score;

                fchild.destroy();
                this.blocks.remove(fchild);
            }
        }
        
        this.bg0.tilePosition.x -= this.bgv0;
        this.bg1.tilePosition.x -= this.bgv1;
        this.bg2.tilePosition.x -= this.bgv2;

        this.powerBar.y = this.hero.y -20;

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

    	if(hero.x + hero.width <= block.x){
			if(!this.kicking){
                this.delayOver();
            }
    	}else{

            this.onGround();
        }
    	return true;
    },
    kickCollisionHandler: function(kick,block) {
        block.destroy();
        this.blocks.remove(block);
        return true;
    },
    delayOver: function() {
    	if(this.clicklock === true){
    		return;
    	}

        for(var i=0; i<this.blocks.children.length;i++){
            var fchild = this.blocks.children[i];
            fchild.body.velocity.x = fchild.body.velocity.y = 0;

            console.log('v',fchild.body.velocity.x);
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
    doKick: function() {
        if(this.kicking){
            return;
        }
        this.kicking = true;
        this.kickSound.play();


        this.powerKick.x=this.hero.x;
        this.powerKick.y=this.hero.y-32;

        this.hero.body.velocity.y=0;
        this.hero.body.moves = false;
        this.hero.alpha=0;


        this.powerKick.animations.play('fly');
        //this.powerKick.body.velocity.x = 1000;
        this.kickTimer = game.time.events.add(Phaser.Timer.SECOND * .25, this.endKick, this);
        console.log('holdX',this.holdX);
        console.log('holdY',this.holdY);

    },
    endKick: function() {

        game.time.events.remove(this.kickTimer);
        this.kicking=false;

        this.hero.alpha=1;
        this.hero.x = this.hero.x+116;

        this.hero.body.moves = true;
        this.powerKick.x = -100;
        this.powerKick.y = -100;

    }
}