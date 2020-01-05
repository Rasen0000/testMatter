'use strict';
//	Пусть все твои JS-файлы всегда начинаются с такой строки, как выше. Она должна быть самая первая.


//	везде использовать var — тухлая тема.
//	https://learn.javascript.ru/let-const
//	используй const везде, где это возможно. в остальных 5% случаев используй let.


const generateBrickWall = (fromX, fromY) => {
	const HEIGHT_BRICKS = 20;
	const WIDTH_BRICKS = 14;

	const BRICK_SIZE = {
		height: 9,
		width: 14
	};

	const result = [];

	for (let brickX = 0; brickX < WIDTH_BRICKS; brickX += 1) {
		for (let brickY = 0; brickY < HEIGHT_BRICKS; brickY += 1) {

			result.push(Matter.Bodies.rectangle(
				fromX + brickX * BRICK_SIZE.width,
				fromY + brickY * BRICK_SIZE.height,
				BRICK_SIZE.width,
				BRICK_SIZE.height
			));
		}
	}

	return result;
};


const runMyShit = () => {
	const Engine = Matter.Engine, /// содержит методы для создания и управления движками
		Render = Matter.Render, ///базовый рендерер на основе холста HTML5. Этот модуль необходим для визуализации различных движков.
		World = Matter.World, /// используется для создания и управления миром, в котором работает движок
		Bodies = Matter.Bodies; ////позволяет создавать объекты твердого тела

	const engine = Engine.create(); ///создания нового движка

	const SCREEN_SIZE = {
		width: document.body.clientWidth,
		height: document.body.clientHeight
	};

	const render = Render.create({	/// создания нового рендерера
		element: window.document.body,	///ключ element, куда библиотека вставляет холст, можно поменять на canvas
		engine: engine, ///указание движка, который должен использоваться для визуализации мира
		options: {
			width: SCREEN_SIZE.width,
			height: SCREEN_SIZE.height,
			wireframes: false ////каркас
		}
	});

	const mouse = Matter.Mouse.create(render.canvas);


	const ballA = Bodies.circle(500, 50, 30); ///круг x/y/радиус/
	Matter.Body.setMass(ballA, 1000);

	const ballB = Bodies.circle(460, 10, 40); ///кругляш
	Matter.Body.setMass(ballB, 10);

	const GROUND_HEIGHT = 30;
	const ground = Bodies.rectangle(0, SCREEN_SIZE.height - GROUND_HEIGHT, SCREEN_SIZE.width, GROUND_HEIGHT, { isStatic: true });

	Matter.Body.rotate(ground, -Math.PI / 80 );

	World.add(engine.world, [
		Bodies.rectangle(160, SCREEN_SIZE.height - 2 * GROUND_HEIGHT, 110, GROUND_HEIGHT),
		ballA,
		ballB,
		ground,

		Bodies.rectangle(80, SCREEN_SIZE.height - 30 * GROUND_HEIGHT, 40, GROUND_HEIGHT, { isStatic: true }),
		Bodies.rectangle(160, SCREEN_SIZE.height - 10 * GROUND_HEIGHT, 60, GROUND_HEIGHT, { isStatic: true }),

		Bodies.rectangle(0, SCREEN_SIZE.height - 2 * GROUND_HEIGHT, 40, 2 * GROUND_HEIGHT, { isStatic: true })
	]);


	World.add(engine.world, Matter.MouseConstraint.create(engine, { mouse: mouse }));

	/*	Фрагмент кода ниже добавляет 3 шарика, соединенных попарно жесткой связью*/
	const connectedBalls = [
		Bodies.circle(100, 50, 30),
		Bodies.circle(200, 120, 25),
		Bodies.circle(250, 80, 10)
	];

	World.add(engine.world, [
		...connectedBalls,
		Matter.Constraint.create({ bodyA: connectedBalls[0], bodyB: connectedBalls[1], lineWidth: 1 }),
		Matter.Constraint.create({ bodyA: connectedBalls[1], bodyB: connectedBalls[2], lineWidth: 1 })
	]);


	//	это добавляет кирпичную стену
	World.add(engine.world, generateBrickWall(100, SCREEN_SIZE.height - 15 * GROUND_HEIGHT));




	Engine.run(engine); ///запуск движка
	Render.run(render); ///запуск рендера
};


window.onload = runMyShit;