import React, { useMemo } from "react";
import { Avatar } from "./Avatar";
import { RoomProvider, useOthers, useSelf } from "@liveblocks/react";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import { generateRandomName } from "@/lib/utils";

function ActiveUsers() {
	const users = useOthers();
	const currentUser = useSelf();
	const hasMoreUsers = users.length > 3;

	console.log(currentUser);

	return (
		<main className="flex h-screen w-full select-none place-content-center place-items-center">
			{currentUser && (
				<Avatar name="You" otherStyles="border-[3px] border-primary-green" />
			)}
			<div className="flex pl-3">
				{users?.slice(0, 3)?.map(({ connectionId, info }) => {
					return (
						<Avatar
							key={connectionId}
							name={generateRandomName()}
							otherStyles="-ml-3"
						/>
					);
				})}

				{hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}
			</div>
		</main>
	);
}

export default ActiveUsers;
