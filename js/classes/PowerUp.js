class PowerUp extends Phaser.Sprite {

    constructor(x,y) {
        super(game,x,y,"powerup",0);
        this.type="powerup";

        game.physics.enable(this, Phaser.Physics.ARCADE);

        // Add gravity
        this.body.gravity.y = 200;
        this.body.velocity.setTo(-200, 200);
        this.body.bounce.set(0.8);

    }


}