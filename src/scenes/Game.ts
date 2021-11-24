import AnimationKeys from "../consts/AnimationKeys";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "../consts/TextureKeys";
import LaserObstacle from "../game/LaserObstacle";
import RocketMouse from "../game/RocketMouse";

export default class Game extends Phaser.Scene{

    private background!: Phaser.GameObjects.TileSprite
    private mouseHole!: Phaser.GameObjects.Image

    private window1!: Phaser.GameObjects.Image
    private window2!: Phaser.GameObjects.Image
    private windows!: Phaser.GameObjects.Image[]

    private bookcase1!: Phaser.GameObjects.Image
    private bookcase2!: Phaser.GameObjects.Image
    private bookcases!: Phaser.GameObjects.Image[]

    private laserObstacle!: LaserObstacle;

    private mouse!: RocketMouse

    private coins!: Phaser.Physics.Arcade.StaticGroup

    private scoreLabel!: Phaser.GameObjects.Text
    private score:number = 0

    constructor(){
        super(SceneKeys.Game)
    }
    init(){
        this.score = 0;
    }
    public preload():void{

    }
    /**
     * Creates the game
     */
    public create():void{
        const width = this.scale.width;
        const height = this.scale.height;
        /**
         * Add an TileSprite (repeadted image) on a position from 0 - 1 
         * 0 being left or top and 1 being right or bottom 
         * The width and height are given to calculate how much to repeat the image troughout the screen
         */
        this.background = this.add.tileSprite(0, 0, width, height, TextureKeys.Background)
            .setOrigin(0,0)
            .setScrollFactor(0,0); // Keep from scrolling

        this.mouseHole = this.add.image(
            Phaser.Math.Between(900, 1500),
            502,
            TextureKeys.MouseHole
        )
        this.window1 = this.add.image(
            Phaser.Math.Between(900, 1300),
            Phaser.Math.Between(150, 250), 
            TextureKeys.Window1
        );
        this.window2 = this.add.image(
            Phaser.Math.Between(1600, 2000),
            Phaser.Math.Between(150, 250), 
            TextureKeys.Window2
        );
        this.windows = [this.window1, this.window2]
        this.bookcase1 = this.add.image(
            Phaser.Math.Between(2200, 2700),
            580, 
            TextureKeys.Bookcase1
        ).setOrigin(0.5, 1);
        this.bookcase2 = this.add.image(
            Phaser.Math.Between(2900, 3400),
            580, 
            TextureKeys.Bookcase2
        ).setOrigin(0.5, 1);
        this.bookcases = [this.bookcase1, this.bookcase2]
        this.laserObstacle = new LaserObstacle(this, 900, 100)
        this.add.existing(this.laserObstacle)
        this.mouse = new RocketMouse(this, width * 0.5, height - 30)
        this.add.existing(this.mouse);
        
        this.coins = this.physics.add.staticGroup()
        this.spawnCoins()

        const body = this.mouse.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setVelocityX(200);
        // Setting world bounds
        this.physics.world.setBounds(
            0, // X 
            0, // Y
            Number.MAX_SAFE_INTEGER, // Width
            height -55 // Height
        )

        this.cameras.main.startFollow(this.mouse);
        this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER, height)

        this.physics.add.overlap(
            this.laserObstacle,
            this.mouse,
            this.handleOverlapLaser,
            undefined,
            this
        )

        this.physics.add.overlap(
            this.coins,
            this.mouse,
            this.handleCollectCoin,
            undefined,
            this
        )

        this.scoreLabel = this.add.text(10, 10, `Score: ${this.score}`, {
            fontSize: "24px",
            color: "#080808",
            backgroundColor: "#F8E71C",
            shadow: {fill: true, blur: 0, offsetY: 0},
            padding: {left: 15, right: 15, top: 10, bottom: 10}
        }).setScrollFactor(0)
    }
    update(t: number, dt: number){
        this.wrapMouseHole()
        this.wrapWindows()
        this.wrapBookcases()
        this.wrapLaserObstacle()
        this.background.setTilePosition(this.cameras.main.scrollX);
        
        this.teleportBackwards()
    }
    private teleportBackwards(){
        const scrollX = this.cameras.main.scrollX
        const maxX = 2380

        if (scrollX > maxX) {
            this.mouse.x -= maxX
            this.mouseHole.x -= maxX

            this.windows.forEach(win=>{
                win.x -= maxX
            })
            this.bookcases.forEach(bc=>{
                bc.x -= maxX
            })

            this.laserObstacle.x -= maxX

            const laserBody = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody
            laserBody.x -= maxX

            this.spawnCoins()
            
            this.coins.children.each(child => {
                const coin = child as Phaser.Physics.Arcade.Sprite
                if (!coin.active) {
                    return
                }

                coin.x -= maxX
                const body = coin.body as Phaser.Physics.Arcade.StaticBody
                body.updateFromGameObject()
            })
        }
    }
    private handleCollectCoin(
        obj1: Phaser.GameObjects.GameObject,
        obj2: Phaser.GameObjects.GameObject
    ){
        const coin = obj2 as Phaser.Physics.Arcade.Sprite;

        this.coins.killAndHide(coin);
        coin.body.enable = false;

        this.score += 1;
        this.scoreLabel.text = `Score: ${this.score}`;
    }
    private spawnCoins(){
        this.coins.children.each(child => {
            const coin = child as Phaser.Physics.Arcade.Sprite
            this.coins.killAndHide(coin)
            coin.body.enable = false
        })

        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        let x = rightEdge + 100;

        const numCoins = Phaser.Math.Between(1,20)

        for (let i = 0; i < numCoins; i++) {
            const coin = this.coins.get(
                x,
                Phaser.Math.Between(100, this.scale.height -100),
                TextureKeys.Coin
            ) as Phaser.Physics.Arcade.Sprite

            coin.setVisible(true)
            coin.setActive(true)

            const body = coin.body as Phaser.Physics.Arcade.StaticBody
            body.setCircle(body.width * 0.5)
            body.enable = true
            
            // Update new coins body
            body.updateFromGameObject()
            x += coin.width * 1.5;
            
        }
    }
    private handleOverlapLaser(
        obj1: Phaser.GameObjects.GameObject,
        obj2: Phaser.GameObjects.GameObject
    ){
        console.log("overlap!")
        this.mouse.kill()
    }
    private wrapMouseHole(){
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        if(this.mouseHole.x + this.mouseHole.width < scrollX){
            this.mouseHole.x = Phaser.Math.Between(rightEdge+100,
                rightEdge + 1000);
        }
    }
    private wrapLaserObstacle(){
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        const body = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody

        const width = this.laserObstacle.width
        if(this.laserObstacle.x + width < scrollX){
            this.laserObstacle.x = Phaser.Math.Between(
                rightEdge+100,
                rightEdge + 1000
            );
            this.laserObstacle.y = Phaser.Math.Between(0, 300);

            body.position.x = this.laserObstacle.x + body.offset.x
            body.position.y = this.laserObstacle.y
        }
    }
    private wrapWindows(){
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        let width = this.window1.width * 2
        if ( this.window1.x + width < scrollX ){
            
            this.window1.x = Phaser.Math.Between(
                rightEdge + width,
                rightEdge + width + 800
            );

            const overlap = this.bookcases.find(bc=>{
                return Math.abs(this.window1.x - bc.x) <= this.window1.width
            })
            
            this.window1.visible = !overlap;
        }

        width = this.window2.width
        if( this.window2.x + width < scrollX ){
            
            this.window2.x = Phaser.Math.Between(
                this.window1.x + width,
                this.window1.x + width + 800
            )
            
            const overlap = this.bookcases.find(bc=>{
                return Math.abs(this.window2.x - bc.x) <= this.window2.width
            })
            
            this.window2.visible = !overlap;
        }
    }
    private wrapBookcases(){
        const scrollX = this.cameras.main.scrollX
        const rightEdge = scrollX + this.scale.width

        let width = this.bookcase1.width * 2;
        if(this.bookcase1.x + width < scrollX){
            this.bookcase1.x = Phaser.Math.Between(
                rightEdge + width,
                rightEdge + width + 800
            )
        }

        width = this.bookcase2.width * 2;
        if(this.bookcase2.x + width < scrollX){
            this.bookcase2.x = Phaser.Math.Between(
                this.bookcase1.x + width,
                this.bookcase1.x + width + 800
            )

            this.spawnCoins()
        }
    }
}