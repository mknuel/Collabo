import React, { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursor/LiveCursors";
import {
	useBroadcastEvent,
	useEventListener,
	useMyPresence,
	useOthers,
} from "@liveblocks/react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import ReactionSelector from "./reaction/ReactionButton";
import FlyingReaction from "./reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";
function Live() {
	const others = useOthers();

	const [{ cursor }, updateMyPresence] = useMyPresence() as any;

	const [cursorState, setCursorState] = useState<CursorState>({
		mode: CursorMode.Hidden,
	});

	const [reaction, setReaction] = useState<Reaction[]>([]);

	const broadcast = useBroadcastEvent();

	useEventListener((eventData) => {
		const event = eventData.event as ReactionEvent;
		setReaction((reactions) =>
			reactions.concat([
				{
					point: { x: event.x, y: event.y },
					value: event.value,
					timestamp: Date.now(),
				},
			])
		);
	});

	useInterval(() => {
		setReaction((reactions) =>
			reactions.filter((r) => r.timestamp > Date.now() - 4000)
		);
	}, 1000);

	useInterval(() => {
		if (
			cursorState.mode === CursorMode.Reaction &&
			cursorState.isPressed &&
			cursor
		) {
			console.log("is reacting");
			setReaction((reactions) =>
				reactions.concat([
					{
						point: { x: cursor.x, y: cursor.y },
						value: cursorState.reaction,
						timestamp: Date.now(),
					},
				])
			);
			broadcast({
				x: cursor.x,
				y: cursor.y,
				value: cursorState.reaction,
			});
		}
	}, 100);

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

	const handlePointerDown = useCallback(
		(e: React.PointerEvent) => {
			updateMyPresence({
				cursor: {
					x: e.clientX - e.currentTarget.getBoundingClientRect().x,
					y: e.clientY - e.currentTarget.getBoundingClientRect().y,
				},
			});

			setCursorState((state: CursorState) =>
				cursorState.mode === CursorMode.Reaction
					? { ...state, isPressed: true }
					: state
			);
		},
		[cursorState.mode, setCursorState]
	);

	const handlePointerUp = useCallback(
		(e: React.PointerEvent) => {
			setCursorState((state: CursorState) =>
				cursorState.mode === CursorMode.Reaction
					? { ...state, isPressed: true }
					: state
			);
		},
		[cursorState.mode, setCursorState]
	);

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
	}, [updateMyPresence]);

	const setReactions = useCallback((reaction: string) => {
		setCursorState({
			mode: CursorMode.Reaction,
			reaction,
			isPressed: false,
		});
	}, []);

	return (
		<div
			className="h-screen w-full flex justify-center items-center "
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}>
			{reaction.map((r) => (
				<FlyingReaction
					key={r.timestamp.toString()}
					x={r.point.x}
					y={r.point.y}
					timestamp={r.timestamp}
					value={r.value}
				/>
			))}
			{cursor && (
				<CursorChat
					cursor={cursor}
					cursorState={cursorState}
					setCursorState={setCursorState}
					updateMyPresence={updateMyPresence}
				/>
			)}
			{cursorState.mode === CursorMode.ReactionSelector && (
				<ReactionSelector setReaction={setReactions} />
			)}
			<LiveCursors others={others} />
		</div>
	);
}

export default Live;
