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
    <div className="w-full flex items-center p-4 ">
      <button
        className="btn-sm bg-red-500 text-white rounded ml-auto "
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Layout;



