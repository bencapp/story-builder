import "./EndNav.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

function EndNav() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const allUsers = useSelector((store) => store.allUsers);
  const currentUser = useSelector((store) => store.user);

  const invites = useSelector((store) => store.invites);

  useEffect(() => {
    dispatch({ type: "FETCH_ALL_USERS" });
    dispatch({ type: "FETCH_INVITES" });
  }, [currentUser]);

  const handleAccept = () => {};

  const handleInvite = (user) => {
    dispatch({ type: "SET_PENDING_INVITE", payload: user });
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
                .filter((user) => user.id != currentUser.id)
                .map((user) => (
                  <div key={user.id}>
                    <p>{user.username}</p>
                    <button onClick={() => handleInvite(user)}>
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
              invites.map((sentUser, i) => (
                <div key={i}>
                  <p>{sentUser.username}</p>
                  <button onClick={handleAccept}>Accept</button>
                </div>
              ))}
          </section>
        </div>
      </div>
    </div>
  );
}

export default EndNav;
