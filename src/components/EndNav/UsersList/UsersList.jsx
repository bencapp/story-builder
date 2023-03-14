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
    // set invited user to user clicked on
    dispatch({ type: "SET_INVITED_USER", payload: invitedUser });
    // redirect to create story page
    if (location.pathname !== "/new-invitation") {
      history.push("/new-invitation");
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
