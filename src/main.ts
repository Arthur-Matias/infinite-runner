import Phaser from 'phaser'
import Game from './scenes/Game'
import GameOver from './scenes/GameOver'
import Preloader from './scenes/Preloader'
const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [Preloader, Game, GameOver]
}

export default new Phaser.Game(config)