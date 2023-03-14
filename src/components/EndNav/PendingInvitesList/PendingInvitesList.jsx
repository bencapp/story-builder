import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Box } from "@mui/system";

function PendingInvitesList() {
  const pendingInvites = useSelector((store) => store.pendingInvites);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "FETCH_PENDING_INVITES" });
  });

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h3>Pending Invites</h3>
      {pendingInvites &&
        pendingInvites.map((invite) => (
          <div key={invite.invite_id}>
            <p>{invite.username}</p>
          </div>
        ))}
    </Box>
  );
}

export default PendingInvitesList;
