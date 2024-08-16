import React from "react";

type Props = {
	setReaction: (reaction: string) => void;
};

export default function ReactionSelector({ setReaction }: Props) {
	return (
		<div
			className="rounded-full bg-white px-2 absolute left-0 bottom-20 transform mx-auto right-0 w-fit"
			onPointerMove={(e) => e.stopPropagation()}>
			<ReactionButton reaction="👍" onSelect={setReaction} />
			<ReactionButton reaction="🔥" onSelect={setReaction} />
			<ReactionButton reaction="🤭" onSelect={setReaction} />
			<ReactionButton reaction="😍" onSelect={setReaction} />
			<ReactionButton reaction="👀" onSelect={setReaction} />
			<ReactionButton reaction="😱" onSelect={setReaction} />
			<ReactionButton reaction="😢" onSelect={setReaction} />
		</div>
	);
}

function ReactionButton({
	reaction,
	onSelect,
}: {
	reaction: string;
	onSelect: (reaction: string) => void;
}) {
	return (
		<button
			className="transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none"
			onPointerDown={() => onSelect(reaction)}>
			{reaction}
		</button>
	);
}
