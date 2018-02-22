var StateMain = {
    preload: function() {
        
        game.load.image("ground", "images/main/ground.png");
        //game.load.image("hero", "images/main/hero.png");
        game.load.spritesheet("hero", 'images/main/hero_anim.png', 32, 32);

        game.load.image("bar", "images/main/powerbar.png");
        game.load.image("block", "images/main/block.png");
    
    },
    create: function() {
        // Keep this line
        // to tell the game what state we are in!
        model.state = "main";
        
		// Variables to contain the player height and width.
		this.pheight = 32;
		this.pwidth = 32;
        
        // A variable to contain jump power.
        this.power = 0;

        
        // Add the ground and the hero to the game stage.
        this.ground = game.add.sprite(0, game.height -32, "ground");
		this.hero = game.add.sprite(game.width * .2, this.ground.y - this.pheight, "hero");
		this.hero.animations.add('run',this.makeArray(0,9),12,true);
		this.hero.animations.add('jump',[0],12,false);
		this.hero.animations.add('die',this.makeArray(10,16),12,false);
		this.hero.animations.play('run');
		
		// Add the power bar at the top of the hero graphic. Add this code AFTER the this.hero line
		this.powerBar = game.add.sprite(this.hero.x, this.hero.y-20, "bar");
		
		// Set the powerbar width to zero. We won't be able to see it, but it's there!
		this.powerBar.width = 0;
		
		// Turn the background sky blue.
		game.stage.backgroundColor="#00ffff"; 
		
		// Add a listener for mouse down input.
		game.input.onDown.add(this.mouseDown, this);
                
        // Start the physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Enable the physics on the hero and ground.
		game.physics.enable(this.hero, Phaser.Physics.ARCADE);
		game.physics.enable(this.ground, Phaser.Physics.ARCADE);
		
		
		// Add gravity			
		this.hero.body.gravity.y = 200;	
		this.hero.body.collideWorldBounds = true;
		this.ground.body.immovable = true;
		
		// Add blocks
		this.blocks = game.add.group();
        this.makeBlocks(); // Now write the makeBlocks function.
		
		// Record the initial position of the hero.
		this.startY = this.hero.y;
		
		// Use this to prevent clicking when game is over.
		this.clickLock = false;
			
    },
	makeArray:function(start,end) {
        var myArray=[];
        for (var i = start; i < end; i++) {
            myArray.push(i);
        }
        return myArray;
    },
    update: function() {
    
    	// Allow collisions between hero and ground.
        game.physics.arcade.collide(this.hero, this.ground, this.onGround, null, this);
		
		// Collide the hero with the blocks.
        game.physics.arcade.collide(this.hero, this.blocks, function(obj1,obj2){ this.collisionHandler(obj1,obj2); }, null, this);
        

        
    
    	// Get the first child. Add this to the update function.
        var fchild = this.blocks.getChildAt(0);
        // If off the screen reset the blocks.
        if (fchild.x + 64 < 0) {
            this.makeBlocks();
        }

    
    },
    mouseDown: function() {
    
    	if (this.clickLock) {
            return;
        }
    
		// If we're not on the ground, no jumping
		if (this.hero.y != this.startY) {
			return;
		}

 		// Stop listening for mouse down for now
    	game.input.onDown.remove(this.mouseDown, this);
        
        // This timer runs 1000 times a second. This will give us a smooth power bar effect.
        this.timer = game.time.events.loop(Phaser.Timer.SECOND / 250, this.increasePower, this);

		// Start listening for mouse up.
        game.input.onUp.add(this.mouseUp, this);
        
    },
    increasePower: function() {
    	var maxPower = 25;
        this.power++;
        this.powerBar.width = 128 *  (this.power/maxPower);
        if (this.power > maxPower) {
            this.power = maxPower;
        }
    },
    mouseUp:function() {

	   	// Stop listening for mouse up for now.
	    game.input.onUp.remove(this.mouseUp, this);
	                    this.hero.animations.play('jump');

	    // Call our jump function
	    this.doJump();
	    
	    // Destroy the timer
        game.time.events.remove(this.timer);
        
        // Reset power
        this.power = 0;
        this.powerBar.width = 0;
        
        // Start listening for mouse down again.
		game.input.onDown.add(this.mouseDown, this);
	   
	},
	doJump: function() {
		// We only want to the y velocity and we want to set it to a negative number to make it go upwards.
        this.hero.body.velocity.y = -this.power * 16;

    },
	onGround: function() {
        if (this.hero)
        {
            this.hero.animations.play('run');
        }        
    },
	makeBlocks: function() {
	
		// Remove all the blocks from the group. You don't want to fill up memory.
        this.blocks.removeAll();
	
		var bStartX=game.width, bStartY=game.height-32-64;
	
        var rndPos, block;
        
        block = game.add.sprite(bStartX, bStartY, "block");
        this.blocks.add(block);
        block = game.add.sprite(bStartX, bStartY - ( 6 * 64 ), "block");
        this.blocks.add(block);

        var wallHeight=game.rnd.integerInRange(2, 4);
        for (var i = 0; i < wallHeight; i++) {
        	rndPos = game.rnd.integerInRange(0,7);
            block = game.add.sprite(bStartX, bStartY - ( rndPos * 64 ), "block");
            this.blocks.add(block);
        }
        
        		// Add this to the makeBlocks function
	    // Loop through each block
        // and apply physics
        this.blocks.forEach(function(block) {
            //enable physics
            game.physics.enable(block, Phaser.Physics.ARCADE);
            block.body.velocity.x = -150;

        });
        
    },
    collisionHandler: function(hero,block) {
    	// If the hero has collided with the front of the block, end the game.
    	if(hero.x + hero.width <= block.x){
			this.delayOver();	
    	}
    	return true;
    },
    delayOver: function() {
    	if(this.clicklock){
    		return;
    	}
        this.clickLock = true;
        this.hero.animations.play('die');
        game.time.events.add(Phaser.Timer.SECOND, this.gameOver, this);
    },
    gameOver: function() {
        game.state.start("StateOver");
    },
}