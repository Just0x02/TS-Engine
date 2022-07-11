// const walls: Mili.Line[] = [];
// const windowRect: Mili.Rect = renderer.WindowRect;

// walls.push(new Mili.Line(windowRect.TopLeft.Add(-1, -1), windowRect.TopRight.Add(-1, -1)));
// walls.push(new Mili.Line(windowRect.TopRight.Add(-1, -1), windowRect.BottomRight.Add(1, 1)));
// walls.push(new Mili.Line(windowRect.BottomRight.Add(1, 1), windowRect.BottomLeft.Add(1, 1)));
// walls.push(new Mili.Line(windowRect.BottomLeft.Add(1, 1), windowRect.TopLeft.Add(-1, -1)));

// for (let i = 0; i < 4; i++)
// {
// 	walls.push(
// 		new Line(
// 			Mili.Vec2.Random(windowRect),
// 			Mili.Vec2.Random(windowRect)
// 		)
// 	);
// }

// const view: Mili.Ray2dView = new Mili.Ray2dView(renderer.WindowCenter);

// WindowEvents.onClick((ev) => {
// 	const startPos: Vec2 = view.pos.Copy();
// 	new RendererSubProcess('pre-render', async (renderer, proc) => {
// 		let percentage: number = (performance.now() - proc.startTime) / 2000;

// 		view.pos.Set(Vec2.Lerp(startPos, ev, percentage));
// 		// console.log(`%=${percentage}, target=${ev.x},${ev.y} curr=${view.pos.x},${view.pos.y}`);

// 		if (percentage >= 1.0) return false;
// 	}).Attach(renderer);
// });

// renderer.RegisterTarget({
// 	async Render(renderer: Renderer)
// 	{
// 		renderer.ctx.strokeStyle = "#999";
// 		for (let wall of walls)
// 			renderer.ctx.stroke(wall.Path);

		
// 		await view.Render(renderer);
// 		await view.Look(renderer, walls);
// 	}
// });