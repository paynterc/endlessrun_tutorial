class Enemy extends Phaser.Sprite {

    constructor(x,y) {
    	super(game,x,y,"enemy1",0);

		game.physics.enable(this, Phaser.Physics.ARCADE);

		// Add gravity			
		this.body.gravity.y = 200;	
		this.body.collideWorldBounds = true;
		
		this.body.velocity.setTo(-200, 200);
		this.body.bounce.set(0.8);
		
    	//add to stage right away
    	game.add.existing(this);

    }

}