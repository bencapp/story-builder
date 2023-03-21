import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material";

function TitleFormCompletedMessage({ actingUserID, type, title }) {
  const history = useHistory();

  const theme = useTheme();

  const currentUser = useSelector((store) => store.user);

  const handleGoHome = () => {
    history.push("/home");
    window.location.reload(false);
  };

  return (
    <Box
      sx={{
        fontSize: "20px",
        textAlign: "center",
        marginTop: "10px",
      }}
    >
      {type == "deleted" && actingUserID !== currentUser.id ? (
        <Box>
          The story has been deleted. Your partner chose not to share it.
        </Box>
      ) : type == "deleted" ? (
        <Box>Story successfully deleted.</Box>
      ) : type == "published" && actingUserID == currentUser.id ? (
        <Box>
          Story successfully published! Check out the home page to view it.
        </Box>
      ) : (
        <Box>
          Your partner has published the story with the title: <b>{title}</b>
        </Box>
      )}
      <Button
        sx={{ marginTop: "10px", border: "1px solid black" }}
        onClick={handleGoHome}
      >
        HOME PAGE
      </Button>
    </Box>
  );
}

export default TitleFormCompletedMessage;
