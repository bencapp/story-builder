import "./EndNav.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

function EndNav() {
  const dispatch = useDispatch();
  const allUsers = useSelector((store) => store.allUsers);

  useEffect(() => {
    dispatch({ type: "FETCH_ALL_USERS" });
  }, []);

  return (
    <div className="nav">
      <div className="nav-contents">
        <h3>Users</h3>
        <ul>{allUsers && allUsers.map((user) => <li>{user.username}</li>)}</ul>
      </div>
    </div>
  );
}

export default EndNav;
