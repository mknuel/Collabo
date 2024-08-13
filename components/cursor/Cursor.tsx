import React from "react";
import CursorSVG from "@/public/assets/CursorSVG";

type Props = {
	x: number;
	y: number;
	color: string;
	message: string;
};

function Cursor({ color, x, y, message }: Props) {
	return (
		<div
			className="pointer-events-none absolute top-0 left-0"
			style={{
				transform: `translate(${x}px, ${y}px)`,
			}}>
            <CursorSVG color={color} />
            
            {/* Message */}
		</div>
	);
}

export default Cursor;
