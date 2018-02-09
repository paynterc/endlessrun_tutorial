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
        
        // A variable to contain the player height.
        this.pheight = 32;
        
        // Add the ground and the hero to the game stage.
        this.ground = game.add.sprite(0, game.height -32, "ground");
		this.hero = game.add.sprite(game.width * .2, this.ground.y - this.pheight, "hero");
		
		// Turn the background sky blue.
		game.stage.backgroundColor="#00ffff"; 
        
    },
    update: function() {}
}