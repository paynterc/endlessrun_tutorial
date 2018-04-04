class Block extends Phaser.Sprite {

    constructor(x,y) {

        var img = "block";
        var spd = -128;
        var r = game.rnd.integerInRange(0,8);

        if(r==8){
            img = "missile";
            spd = -250;
        }

        super(game,x,y,img,0);


        //enable physics
        game.physics.enable(this, Phaser.Physics.ARCADE);
        //block.allowGravity=false;
        this.allowRotation=false;
        this.body.immovable = true;
        this.body.friction.x=0;
        this.body.velocity.x = spd;



    }

}