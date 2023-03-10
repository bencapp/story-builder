import "./EndNav.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

function EndNav() {
  const dispatch = useDispatch();
  const allUsers = useSelector((store) => store.allUsers);
  const currentUser = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_ALL_USERS" });
  }, []);

  return (
    <div className="nav">
      <div className="nav-contents">
        <h3>Users</h3>
        <section>
          {allUsers &&
            allUsers
              .filter((user) => user.id != currentUser.id)
              .map((user) => (
                <div key={user.id}>
                  <p>{user.username}</p>
                  <button>Invite to Game</button>
                </div>
              ))}
        </section>
      </div>
    </div>
  );
}

export default EndNav;
