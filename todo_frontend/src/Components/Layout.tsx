import { useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/", {
      state: { logoutSuccess: true },
    });
  };

  return (
    <div className="m-2">
      <button
        className="btn-sm bg-red-500 text-white rounded mx-2 "
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Layout;
