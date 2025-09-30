import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import CrudTable from "./components/CrudTable";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import BlogPostPage from "./pages/BlogPostPage";
import ComponentsPage from "./pages/ComponentsPage";
import ComponentDetail from "./pages/ComponentDetail";
import { AuthContext } from "./context/AuthContext";

function App() {
  // const [user, setUser] = useState({
  //   name: "John Doe",
  //   profilePic: "https://i.pravatar.cc/150?img=3",
  // });

  // const handleLogout = () => {
  //   setUser(null);
  // };

  // return (
  //   <div className="flex flex-col min-h-screen bg-indigo-50">
  //     <header className="sticky top-0 z-50">
  //       <NavigationBar user={user} onLogout={handleLogout} />
  //     </header>

  //     <main className="flex-grow container mx-auto px-6 py-8">
  //       <CrudTable user={user} />
  //     </main>

  //     {/* <footer className="sticky bottom-0 z-50"> */}
  //       <Footer />
  //     {/* </footer> */}
  //   </div>
  // );

  // Mock authentication state (replace with your auth logic, e.g., JWT or API call)
  const [user, setUser] = useState(null); // Set to user object when logged in, null when logged out

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <NavigationBar />

        <div className="relative min-h-screen bg-cover bg-center bg-fixed bg-gray-100" style={{ backgroundImage: `url(/images/backgroundImage.png)` }} >
          {/* <div className="absolute inset-0 bg-opacity-20"></div> */}
          <Routes>
            <Route path="/" element={<ProtectedRoute component={Home} user={user} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/posts/:userId" element={<BlogPostPage />} />
            <Route path="/components" element={<ComponentsPage />} />
            <Route path="/components/:id" element={<ComponentDetail />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthContext.Provider>
    
  );
}

// ProtectedRoute component to guard routes
function ProtectedRoute({ component: Component, user, ...rest }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? <Component user={user} /> : null;
}

export default App;
