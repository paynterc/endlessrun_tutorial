class MediaManager {


    constructor() {
        this.soundArray=[];
        this.musicArray=[];
        this.musicKey=false;
        this.musicPlaying = false
        eventDispatcher.add(this.gotEvent, this);
    }
    gotEvent(call, params) {
        switch (call) {
            case G.PLAY_SOUND:
                this.playSound(params);
                break;
            case G.MUSIC_STAT_CHANGED:
                this.updateMusic();
                break;
        }
    }
    addSound(key) {
        this.soundArray[key] = game.add.audio(key);

    }
    playSound(key) {
        if (model.soundOn == true) {
            this.soundArray[key].play();
        }
    }
    addMusic(key) {
        this.musicArray[key] = game.add.audio(key);
        this.musicArray[key].loop = true;
        this.musicArray[key].volume = 0;
        this.musicArray[key].play();

    }
    setBackgroundMusic(key) {

        console.log('musicArray',this.musicArray);
        if(this.musicArray.hasOwnProperty(key)){

            for (var key1 in this.musicArray) {
                this.musicArray[key1].volume=0;
            }

            this.musicKey=key;
            console.log('propValue',this.musicArray[key]);
            if(model.musicOn == true){
                this.musicArray[key].volume = .5;
            }
        }

    }
    setBackgroundMusicFadeIn(newKey) {

        if(!this.musicArray.hasOwnProperty(newKey)){
            return;
        }

        if ( this.musicArray.hasOwnProperty(this.musicKey) ) {
            game.add.tween(this.musicArray[this.musicKey]).to({volume:0}, 5000).start();
        }

        this.musicArray[newKey].volume = 0;
        if(model.musicOn == true){
            game.add.tween(this.musicArray[newKey]).to({volume:.5}, 5000).start();
        }
        this.musicKey=newKey;


    }
    restartMusic(key){
        if(this.musicArray.hasOwnProperty(key)){
            this.musicArray[key].stop();
            this.musicArray[key].play();
        }
    }
    updateMusic() {
        console.log('UPDATE MUSIC');
        for (var key1 in this.musicArray) {
            this.musicArray[key1].volume=0;
        }
        if (model._musicOn == true) {
            this.musicPlaying = true;

            if(this.musicArray.hasOwnProperty(this.musicKey)){
                this.musicArray[this.musicKey].volume = .5;
            }

        } else {
            this.musicPlaying = false;
        }
    }
}