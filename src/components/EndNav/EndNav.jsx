import "./EndNav.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

function EndNav({ socket }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const allUsers = useSelector((store) => store.allUsers);
  const currentUser = useSelector((store) => store.user);

  const invites = useSelector((store) => store.invites);

  useEffect(() => {
    dispatch({ type: "FETCH_ALL_USERS" });
    dispatch({ type: "FETCH_INVITES" });

    // socket listener to update invites on invitation
    socket.on("private invite", (invite) => {
      console.log("receiving private invite, 'invite' is:", invite);
      if (invite.invitedUser.id === currentUser.id) {
        console.log("received invite to current user");
        dispatch({ type: "FETCH_INVITES" });
      }
    });

    // socket listener to for when one's invitation was accepted
    // TODO: allow user to navigate to new story instead of
    // being immediately redirected there
    socket.on("accept invite", (sentUser, acceptedUser) => {
      // if user is the one who sent the invite, join the room
      // and redirect to the new story page
      if (currentUser.id == sentUser.id) {
        console.log("invite accepted, joining room and rerouting");
        socket.emit("join room", currentUser);
        if (location.pathname !== "/new-story") {
          history.push("/new-story");
        }
      }
    });
  }, [currentUser]);

  const handleAccept = (invitingUser) => {
    socket.emit("accept invite", invitingUser, currentUser);
    // socket.emit("join room", currentUser);
    history.push("/new-story");
  };

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
    <div className="nav">
      <div>
        <div className="nav-contents">
          <h3>Users</h3>
          <section>
            {allUsers &&
              allUsers
                .filter((invitedUser) => invitedUser.id != currentUser.id)
                .map((invitedUser) => (
                  <div key={invitedUser.id}>
                    <p>{invitedUser.username}</p>
                    <button onClick={() => handleInvite(invitedUser)}>
                      Invite to Game
                    </button>
                  </div>
                ))}
          </section>
        </div>
        <div id="invites-list">
          <h3>Invitations</h3>
          <section>
            {invites &&
              invites.map((sentUser) => (
                <div key={sentUser.id}>
                  <p>{sentUser.username}</p>
                  <button onClick={() => handleAccept(sentUser)}>Accept</button>
                </div>
              ))}
          </section>
        </div>
      </div>
    </div>
  );
}

export default EndNav;
