import React, {Component, Fragment} from 'react';
import 'react-dom';

export default class Circles extends Component {

	render() {

		return (
			<Fragment>
				<section className="circles">
					<canvas id="canvas" className="circles__canvas"/>
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

		this.ctx = this.canvas.getContext('2d');
		this.ctx.globalAlpha = 0.2;

		this.canvasWidth = window.innerWidth;
		this.canvasHeight = window.innerHeight;

		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;

		this.circleLimit = 15; // Кол-во кругов
		this.circlesArr = []; // Массив для отрисовки
		this.text = 'You are so pink';
		this.textSize = 0;
		this.textFont = `13vw Fugue, Helvetica, sans-serif`;
		this.pinkColor = '#F20080';
		this.blackColor = '#000000';
		this.grayColor = '#F4F4F4';
		this.darkGrayColor = '#707070';
		this.colorTheme = 'white';

		this.init();
	}

	// Основная секция приложения
	init() {

		const self = this;

		window.addEventListener('resize', self.resizeCanvas.bind(self));

		// Сохраняем состояние холста
		self.ctx.save();

		// Запускаем отрисовку
		self.animLoop();

		window.addEventListener('changeBackground', () => {

			self.colorTheme = (self.colorTheme === "black") ? "white" : "black";

			if(self.colorTheme === "black") {
				this.blackColor = '#ffffff';
			} else {
				this.blackColor = '#000000';
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
				operation: (Math.random() > 0.9) ? "source-over" : "lighter",
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
			color = self.blackColor
		} = params;

		self.ctx.beginPath();


		if (!params.operation) {
			params.operation = "lighter";
		}

		// self.ctx.globalCompositeOperation = params.operation;
		self.ctx.lineWidth = 1;
		self.ctx.fillStyle = color;
		self.ctx.strokeStyle = color;
		self.ctx.arc(x, y, size, 0, 2 * Math.PI);
		self.ctx.stroke();
		self.ctx.fill();
		self.ctx.closePath();

		// self.ctx.globalCompositeOperation = "source-over";

	}

	randomRange(min, max) {
		return Math.random() * (max - min) + min;
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

	drawScene() {

		const self = this;

		// Очищаем всё напроч
		self.ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight);

		// Генерим круги(свойства и позиции)
		self.makeCircles();
		self.moveCircles();
		self.drawText({source: "xor"});

	}


	resizeCanvas() {

		const self = this;

		self.canvasWidth = window.innerWidth;
		self.canvasHeight = window.innerHeight;

		self.canvas.width = self.canvasWidth;
		self.canvas.height = self.canvasHeight;

	}

	animLoop() {

		this.drawScene();

		requestAnimationFrame(this.animLoop.bind(this));

	}

}
