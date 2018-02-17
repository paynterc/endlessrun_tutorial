var StateMain = {
    preload: function() {
        
        game.load.image("ground", "images/main/ground.png");
        game.load.image("hero", "images/main/hero.png");
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
		
        
    },
    update: function() {
    
    	// Allow collisions between hero and ground.
		game.physics.arcade.collide(this.hero, this.ground);
    
    },
    mouseDown: function() {

 		// Stop listening for mouse down for now
    	game.input.onDown.remove(this.mouseDown, this);
        
        // This timer runs 1000 times a second. This will give us a smooth power bar effect.
        this.timer = game.time.events.loop(Phaser.Timer.SECOND / 1000, this.increasePower, this);

		// Start listening for mouse up.
        game.input.onUp.add(this.mouseUp, this);
        
    },
    increasePower: function() {
        this.power++;
        this.powerBar.width = this.power;
        if (this.power > this.pwidth) {
            this.power = this.pwidth;
        }
    },
    mouseUp:function()
	{

	   	// Stop listening for mouse up for now.
	    game.input.onUp.remove(this.mouseUp, this);
	    
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
	makeBlocks: function() {
		var bStartX=game.width-64, bStartY=game.height-32-64;
	
        var wallHeight=game.rnd.integerInRange(2, 6);
        for (var i = 0; i < wallHeight; i++) {
            var block = game.add.sprite(bStartX, bStartY - ( i * 64 ), "block");
            this.blocks.add(block);
        }
    },
}