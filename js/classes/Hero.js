class Hero extends Phaser.Sprite {
    constructor(x,y) {

    	super(game,x,y,"hero",0);

		game.physics.enable(this, Phaser.Physics.ARCADE);

		// Add gravity			
		this.body.gravity.y = 200;	
		this.body.collideWorldBounds = true;
        this.body.friction.x=0;


        this.animations.add('run',this.makeArray(0,9),12,true);
		this.animations.add('jump',[0],12,false);
        this.animations.add('die',this.makeArray(10,15),12,false);
        this.animations.add('kick',[16],12,false);
		this.animations.play('run');
		
		this.landed=true;
        this.kicking=false;

    	//add to stage right away
    	game.add.existing(this);

    }
    
    makeArray(start,end) {
        var myArray=[];
        for (var i = start; i < end; i++) {
            myArray.push(i);
        }
        return myArray;
    }
    
    doJump(power) {
    
    
    	this.landed=false;
		// We only want to the y velocity and we want to set it to a negative number to make it go up.
        this.body.velocity.y = -power * 8;
        //this.body.velocity.x = power;

        
        // You can access variables in the StateMain
        //console.log('myvar',StateMain.myvar);
        
    }

    doKick() {

        if(this.kicking){
            return;
        }
        this.kicking = true;

        this.body.velocity.x=1000;
        this.body.velocity.y=0;
        this.body.gravity.y=0;
        this.animations.play('kick');

        this.kickTimer = game.time.events.add(Phaser.Timer.SECOND * .15, this.endKick, this);


    }

    endKick() {

        game.time.events.remove(this.kickTimer);
        this.body.gravity.y=200;
        this.body.velocity.x=0;
        this.kicking=false;

    }

    update() {
    	// The update function will run every frame, even if you don't call it.
    	//this.angle += .5;
    }
}