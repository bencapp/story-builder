import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { socket } from "../../../socket";
import { Button, Box } from "@mui/material";

function UsersList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const allUsers = useSelector((store) => store.allUsers);
  const currentUser = useSelector((store) => store.user);

  const handleInvite = (invitedUser) => {
    console.log("in handle invite");
    // dispatch invite to database so that it can be stored for later
    dispatch({ type: "SET_PENDING_INVITE", payload: invitedUser });
    dispatch({ type: "POST_INVITE", payload: invitedUser });

    // also immediately push invite via socket
    socket.emit("private invite", currentUser, invitedUser);

    if (location.pathname !== "/new-story") {
      history.push("/new-story");
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h3>Users</h3>
      <section>
        {allUsers &&
          allUsers
            .filter((invitedUser) => invitedUser.id != currentUser.id)
            .map((invitedUser) => (
              <div key={invitedUser.id}>
                <p>{invitedUser.username}</p>
                <Button
                  color="tertiary"
                  onClick={() => handleInvite(invitedUser)}
                >
                  Invite to Game
                </Button>
              </div>
            ))}
      </section>
    </Box>
  );
}

export default UsersList;
