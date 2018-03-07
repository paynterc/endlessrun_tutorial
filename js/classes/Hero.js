class Hero extends Phaser.Sprite {
    constructor(x,y) {
    	super(game,x,y,"hero",0);

    	//add to stage right away
    	game.add.existing(this);
    	
    	this.animations.add('run',this.makeArray(0,9),12,true);
		this.animations.add('jump',[0],12,false);
		this.animations.add('die',this.makeArray(10,16),12,false);
		this.animations.play('run');
		
		this.landed=true;
    	
    	
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
        this.body.velocity.y = -power * 16;
        
    }
}