import "./EndNav.css";
import { useSelector } from "react-redux";

function EndNav() {
  const allUsers = useSelector((store) => store.allUsers);
  return (
    <div className="nav">
      <h3>Users</h3>
      <p>users array goes here</p>

      {/* need a get request */}
    </div>
  );
}

export default EndNav;
