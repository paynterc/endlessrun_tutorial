class Rain extends Phaser.Sprite {

    constructor(x,y) {
        super(game,x,y,"shard",0);
        this.type="rain";

        game.physics.enable(this, Phaser.Physics.ARCADE);

        // Add gravity
        this.body.gravity.y = 200;
        this.body.setSize(12, 56, 10, 4);
    }


}