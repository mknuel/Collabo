import React, { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursor/LiveCursors";
import { useMyPresence, useOthers } from "@liveblocks/react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode } from "@/types/type";
function Live() {
	const others = useOthers();

	const [{ cursor }, updateMyPresence] = useMyPresence() as any;

	const [cursorState, setCursorState] = useState({
		mode: CursorMode.Hidden,
	});

	const handlePointerMove = useCallback((e: React.PointerEvent) => {
		e.preventDefault();

		updateMyPresence({
			cursor: {
				x: e.clientX - e.currentTarget.getBoundingClientRect().x,
				y: e.clientY - e.currentTarget.getBoundingClientRect().y,
			},
		});
	}, []);

	const handlePointerLeave = useCallback((e: React.PointerEvent) => {
		setCursorState({
			mode: CursorMode.Hidden,
		});
		updateMyPresence({
			cursor: null,
			message: null,
		});
	}, []);

	const handlePointerDown = useCallback((e: React.PointerEvent) => {
		updateMyPresence({
			cursor: {
				x: e.clientX - e.currentTarget.getBoundingClientRect().x,
				y: e.clientY - e.currentTarget.getBoundingClientRect().y,
			},
		});
	}, []);

	useEffect(() => {
		const onKeyUp = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "/") {
				setCursorState({
					mode: CursorMode.Chat,
					previousMessage: null,
					message: "",
				});
			} else if (e.key === "Escape") {
				updateMyPresence({
					message: "",
				});

				setCursorState({
					mode: CursorMode.Hidden,
				});
			}
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "/") {
				e.preventDefault();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
		};
	}, []);

	return (
		<div
			className="h-screen w-full flex justify-center items-center "
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			onPointerDown={handlePointerDown}>
			{cursor && (
				<CursorChat
					cursor={cursor}
					cursorState={cursorState}
					setCursorState={setCursorState}
					updateMyPresence={updateMyPresence}
				/>
			)}
			<LiveCursors others={others} />
		</div>
	);
}

export default Live;
