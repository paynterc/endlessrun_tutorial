class Block extends Phaser.Sprite {

    constructor(x,y) {

        var img = "block";
        var spd = -128;
        var r = game.rnd.integerInRange(0,8);
        var type="block";

        if(r==8){
            img = "missile";
            spd = -250;
            type="missle";
        }

        if(r==7){
            img = "gem";
            type="gem";
        }

        super(game,x,y,img,0);
        this.type=type;
        if(this.type=="gem"){
            this.animations.add('play',[0,1,2],12,true);
            this.animations.play('play');
        }

        //enable physics
        game.physics.enable(this, Phaser.Physics.ARCADE);
        //block.allowGravity=false;
        this.allowRotation=false;
        this.body.immovable = true;
        this.body.friction.x=0;
        this.body.velocity.x = spd;


    }

}