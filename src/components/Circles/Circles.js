import React, {Component, Fragment} from 'react';
import 'react-dom';
import hamsters from 'hamsters.js';

export default class Circles extends Component {

	render() {

		return (
			<Fragment>
				<section className="circles">
					<canvas id="canvas" className="circles__canvas"/>
					<canvas id="canvasTemp" className="circles__canvas  isHidden" />
				</section>
			</Fragment>
		)
	}

	componentDidMount() {
		new Generator();
	}
}

class Generator {

	constructor() {

		this.canvas = document.getElementById('canvas');
		this.canvasTmp = document.getElementById('canvasTemp');

		this.ctx = this.canvas.getContext('2d');
		this.ctx2 = this.canvasTmp.getContext('2d');
		this.ctx.globalAlpha = 0.2;

		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;

		this.canvas.width = this.canvasTmp.width = this.canvasWidth;
		this.canvas.height= this.canvasTmp.height = this.canvasHeight;

		this.circleLimit = 15; // Кол-во кругов
		this.circlesArr = []; // Массив для отрисовки
		this.text = 'You are so pink';
		this.textSize = 0;
		this.textFont = `13vw Fugue, Helvetica, sans-serif`;
		this.pinkColor = '#F20080';
		this.blackColor = 'rgba(0,0,0,0.9)';
		this.grayColor = '#F4F4F4';
		this.darkGrayColor = '#707070';
		this.colorTheme = 'white';

		this.image = new Image();
		this.image.src = "back.jpg";
		this.image.onload = () => {
			this.init();
		};

		this.ticker = 0;
	}

	// Основная секция приложения
	init() {

		const self = this;

		window.addEventListener('resize', self.resizeCanvas.bind(self));

		// Сохраняем состояние холста
		self.ctx.save();

		hamsters.init({
			cache: true,
			memoize: true,
			browser: true,
			reactNative: false,
			node: false
		});

		// Рисуем первоначальный фон
		self.setBackground({withEffect: false});

		// Запускаем отрисовку всей сцены в цикле
		self.animLoop();

		window.addEventListener('changeBackground', () => {

			self.colorTheme = (self.colorTheme === "black") ? "white" : "black";

			if (self.colorTheme === "black") {
				this.blackColor = 'rgba(255,255,255,0.9)';
			} else {
				this.blackColor = 'rgba(0,0,0,0.9)';
			}

		});
	}

	// Генерим случайные сущности
	makeCircles() {

		const self = this;

		let arrLength = self.circlesArr.length - 1;

		while (arrLength <= self.circleLimit) {

			let circleSize = self.randomRange(100, 200); // Размер круга
			let maxSpeed = 20 - (circleSize / 7); // Скорость движения круга
			let startPosition = -circleSize - self.randomRange(50, 500);

			let newCircle = {
				x: self.randomRange(circleSize, self.canvasWidth),
				y: startPosition,
				size: circleSize,
				operation: (Math.random() > 0.7) ? "source-over" : "xor" ,
				killPosition: self.canvasHeight + circleSize,
				speed: self.randomRange(1, maxSpeed)
			};

			self.circlesArr.push(newCircle);
			arrLength++;
		}
	}

	moveCircles() {

		const self = this;
		let dieList = []; // Спиков кругов смертников

		self.circlesArr.forEach((item) => {

			item.y = item.y + item.speed;

			self.drawCircle(item);

			// Проверяем не улетел ли круг за пределы экрана
			if (item.y > item.killPosition) {

				// Помещаем текущий индекс в список на удаление
				let currIndex = self.circlesArr.indexOf(item);
				dieList.push(currIndex);
			}

		});

		// Удаляем ненужные круги массива для отрисовки
		dieList.forEach((item) => {
			self.circlesArr.splice(item, 1);
		});

	}

	// Рисуем сущность(круг) на холсте
	drawCircle(params = {}) {

		const self = this;

		const {
			x = 0,
			y = 50,
			size = 0,
			color = self.blackColor,
			operation,
		} = params;

		self.ctx.beginPath();

		self.ctx.globalCompositeOperation = operation;

		self.ctx.lineWidth = 1;
		self.ctx.fillStyle = color;
		self.ctx.strokeStyle = color;
		self.ctx.arc(x, y, size, 0, 2 * Math.PI);
		self.ctx.stroke();
		self.ctx.fill();
		self.ctx.closePath();

		self.ctx.globalCompositeOperation = "source-over";

	}

	randomRange(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	}

	drawText(params = {}) {

		const self = this;

		const {
			color = self.pinkColor, // Цвет по умолчанию
			source = "source-over"
		} = params;

		self.ctx.globalCompositeOperation = source;

		self.ctx.beginPath();
		self.ctx.fillStyle = color;
		self.ctx.font = self.textFont;

		self.textSize = self.ctx.measureText(self.text);

		let textPosition = {
			x: self.canvasWidth / 2 - self.textSize.width / 2,
			y: (self.canvasHeight / 2),
		};

		self.ctx.fillText(self.text, textPosition.x, textPosition.y, self.canvasWidth);
		self.ctx.closePath();

		self.ctx.globalCompositeOperation = "source-over";

	}

	setBackground(params = {}) {

		const self = this;

		const {
			withEffect = true
		} = params;

		self.chromaticAberration(self.randomRange(20, 40), self.randomRange(0, 1), withEffect);
	}

	chromaticAberration(intensity, phase, withEffect) {

		const self = this;


		self.ctx2.drawImage(self.image, 0, 0, self.canvasWidth, self.canvasHeight);
		/* Use canvas to draw the original image, and load pixel data by calling getImageData
		The ImageData.data is an one-dimentional Uint8Array with all the color elements flattened. The array contains data in the sequence of [r,g,b,a,r,g,b,a...]
		Because of the cross-origin issue, remember to run the demo in a localhost server or the getImageData call will throw error
		*/
		let imageData = self.ctx2.getImageData(0, 0, self.canvasWidth, self.canvasHeight);
		let data = imageData.data;

		if(withEffect) {
			for (let i = phase % 4; i < data.length; i += 4) {
				// Setting the start of the loop to a different integer will change the aberration color, but a start integer of 4n-1 will not work
				data[i] = data[i + 4 * intensity];
			}
		}
		self.ctx2.putImageData(imageData, 0, 0);

		self.ctx.drawImage(self.canvasTmp, 0, 0);

		/*
		// Штука, которая создаёт паралельные потоки вычислений
		let params = {
			array: imageData.data,
			threads: 1
		};
		hamsters.run(params, function() {

			let arr = params.array;
			let tempArr = [];

			// eslint-disable
			for (let i = 1 % 4; i < arr;i += 4) {
				tempArr[i] = arr[i + 4 * 2];
			}
			rtn.data = tempArr;
			// eslint-enable

		}, function(results) {

			// ctx.putImageData(results, 0, 0);

		});
		*/



	}

	drawScene() {

		const self = this;

		// Очищаем всё напроч
		self.ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight);

		// Генерим круги(свойства и позиции)
		self.ticker++;

		if(self.ticker > 150) {

			console.log('setBackground');
			self.setBackground();
			self.ticker = self.randomRange(0, 50);

			// Рисуем предыдущую картинку
		} else if(self.ticker < 40) {

			self.ctx.drawImage(self.canvasTmp, 0, 0);
		} else {

			self.setBackground({withEffect: false});
		}

		self.makeCircles();
		self.moveCircles();
		self.drawText({source: "screen"});

	}


	resizeCanvas() {

		const self = this;

		self.canvasWidth = window.innerWidth;
		self.canvasHeight = window.innerHeight;

		self.canvas.width = self.canvasWidth;
		self.canvas.height = self.canvasTmp.height = self.canvasHeight;
		self.canvas.width = self.canvasTmp.width =  self.canvasWidth;

	}

	animLoop() {

		this.drawScene();

		requestAnimationFrame(this.animLoop.bind(this));


	}

}
