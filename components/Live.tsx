import React, { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursor/LiveCursors";
import { useMyPresence, useOthers } from "@liveblocks/react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, Reaction } from "@/types/type";
import ReactionSelector from "./reaction/ReactionButton";
function Live() {
	const others = useOthers();

	const [{ cursor }, updateMyPresence] = useMyPresence() as any;

	const [cursorState, setCursorState] = useState({
		mode: CursorMode.Hidden,
	});

	const [reaction, setReaction] = useState<Reaction[]>([]);

	const handlePointerMove = useCallback((e: React.PointerEvent) => {
		e.preventDefault();

		if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {
			updateMyPresence({
				cursor: {
					x: e.clientX - e.currentTarget.getBoundingClientRect().x,
					y: e.clientY - e.currentTarget.getBoundingClientRect().y,
				},
			});
		}
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
			} else if ((e.ctrlKey || e.metaKey) && e.key === ".") {
				console.log("reaction");
				setCursorState({
					mode: CursorMode.ReactionSelector,
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

			{cursorState.mode === CursorMode.ReactionSelector && (
				<ReactionSelector setReaction={(reaction) => setReaction(reaction)} />
			)}
			<LiveCursors others={others} />
		</div>
	);
}

export default Live;
