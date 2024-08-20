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

    const memoizedUsers = useMemo(
			() => (
				<div className="flex items-center justify-between gap-1 p-2">
					<div className="flex pl-3 w-fit">
						{currentUser && (
							<Avatar
								name="You"
								otherStyles="border-[3px] border-primary-green"
							/>
						)}
						{users?.slice(0, 3)?.map(({ connectionId, info }) => {
							return (
								<Avatar
									key={connectionId}
									name={generateRandomName()}
									otherStyles="-ml-3"
								/>
							);
						})}

						{hasMoreUsers && (
							<div className={styles.more}>+{users.length - 3}</div>
						)}
					</div>
				</div>
			),
			[users.length]
		);

		return memoizedUsers;
}

export default ActiveUsers;
