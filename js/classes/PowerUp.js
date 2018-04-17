class PowerUp extends Phaser.Sprite {

    constructor(x,y) {
        super(game,x,y,"powerup",0);
        this.type="powerup";

        game.physics.enable(this, Phaser.Physics.ARCADE);

        // Add gravity
        this.body.gravity.y = 200;
        this.body.velocity.setTo(-100, 200);
        this.body.bounce.set(0.8);

        this.animations.add('run',this.makeArray(0,2),6,true);
        this.animations.play('run');

    }

    makeArray(start,end) {
        var myArray=[];
        for (var i = start; i < end; i++) {
            myArray.push(i);
        }
        return myArray;
    }
}