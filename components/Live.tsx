import React from "react";
import LiveCursors from "./cursor/LiveCursors";
import { useOthers } from "@liveblocks/react";
function Live() {
	const others = useOthers();
	return (
		<div>
			<LiveCursors />
		</div>
	);
}

export default Live;
