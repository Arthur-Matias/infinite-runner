import background from '../assets/house/bg_repeat_340x640.png'
import mouseHole from '../assets/house/object_mousehole.png'
import window1 from '../assets/house/object_window1.png'
import window2 from '../assets/house/object_window2.png'
import bookcase1 from '../assets/house/object_bookcase1.png'
import bookcase2 from '../assets/house/object_bookcase2.png'
import laserEnd from '../assets/house/object_laser_end.png'
import coin from '../assets/house/object_coin.png'
import laserMiddle from '../assets/house/object_laser.png'
import rocketMouse from '../assets/characters/rocket-mouse.png'
import rocketMouseData from '../assets/characters/rocket-mouse.json'
import TextureKeys from '../consts/TextureKeys';
import SceneKeys from '../consts/SceneKeys';
import AnimationKeys from '../consts/AnimationKeys';

/**
 * Scene to preload components and assets
 */
export default class Preloader extends Phaser.Scene{
    constructor(){
        super(SceneKeys.Preloader);
    }

    /**
     * Preload Components and assets
     */
    preload(){
        this.load.image(TextureKeys.Background, background);
        this.load.image(TextureKeys.MouseHole, mouseHole);
        this.load.image(TextureKeys.Window1, window1);
        this.load.image(TextureKeys.Window2, window2);
        this.load.image(TextureKeys.Bookcase1, bookcase1);
        this.load.image(TextureKeys.Bookcase2, bookcase2);
        this.load.image(TextureKeys.LaserEnd, laserEnd );
        this.load.image(TextureKeys.LaserMiddle, laserMiddle);

        this.load.image(TextureKeys.Coin, coin);
        //Load the character as an atlas
        this.load.atlas(TextureKeys.RocketMouse,rocketMouse, rocketMouseData);
    }
    create(){
        this.anims.create({
            key: AnimationKeys.RocketMouseRun,
            frames: this.anims.generateFrameNames(TextureKeys.RocketMouse, {
                start: 1,
                end: 4,
                prefix: "rocketmouse_run",
                zeroPad: 2, // ZeroPad is necessary if the animation has more than 9 frames ( not the case, but nice to take note )
                suffix: ".png"
            }),
            // The above code is a shorthand for
            // frames: [
            //     {key: 'rocket-mouse', frame: 'rocketmouse_run01.png'},
            //     {key: 'rocket-mouse', frame: 'rocketmouse_run02.png'},
            //     {key: 'rocket-mouse', frame: 'rocketmouse_run03.png'},
            //     {key: 'rocket-mouse', frame: 'rocketmouse_run04.png'}
            // ],
            frameRate: 10,
            repeat: -1 // repeat is set to -1 so that the animation will loop for as long as it is active
        })
        this.anims.create({
            key: AnimationKeys.RocketMouseFall,
            frames: [{
                key: TextureKeys.RocketMouse,
                frame: "rocketmouse_fall01.png"
            }]
        })
        this.anims.create({
            key: AnimationKeys.RocketMouseFly,
            frames: [{
                key: TextureKeys.RocketMouse,
                frame: "rocketmouse_fly01.png"
            }]
        })
        this.anims.create({
            key: AnimationKeys.RocketFlamesOn,
            frames: this.anims.generateFrameNames(
                TextureKeys.RocketMouse,
                {start: 1, end: 2, prefix: 'flame', suffix: ".png"}),
                frameRate: 10,
                repeat: -1
        })
        this.anims.create({
            key: AnimationKeys.RocketMouseDead,
            frames: this.anims.generateFrameNames(TextureKeys.RocketMouse,
                {
                    start: 1,
                    end: 2,
                    prefix: "rocketmouse_dead",
                    zeroPad: 2,
                    suffix: '.png'
                }),
                frameRate: 10
        })
        this.scene.start(SceneKeys.Game);
    }
}