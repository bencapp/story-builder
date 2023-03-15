import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Box } from "@mui/system";

import { socket } from "../../../socket";

function SentInvites() {
  const pendingInvites = useSelector((store) => store.pendingInvites);
  const currentUser = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "FETCH_PENDING_INVITES" });

    // socket listener to update invites on invitation
    socket.on("private invite", (invite) => {
      console.log("received private invite, invite is", invite);
      if (invite.sender_user_id === currentUser.id) {
        dispatch({ type: "FETCH_PENDING_INVITES" });
      }
    });
  }, []);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h3>Pending Invites</h3>
      {pendingInvites &&
        pendingInvites.map((invite) => (
          <div key={invite.id}>
            <p>{invite.recipient_user_username}</p>
          </div>
        ))}
    </Box>
  );
}

export default SentInvites;
