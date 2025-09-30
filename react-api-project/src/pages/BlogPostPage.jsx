import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogPosts from "../components/BlogPosts";
import CrudForm from "../components/CrudForm";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

export default function BlogPostPage() {
  const baseUrl = "http://192.168.1.5:3000/api";
  const { user } = useContext(AuthContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSavePost = async (data) => {
    try {
      const postData = { ...data, userId };
      const response = await fetch(baseUrl+"/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      Swal.fire({
        title: "Success!",
        text: "The post has been created.",
        icon: "success",
        confirmButtonColor: "#12b403ff",
      });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
    setIsFormOpen(false);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Back to Users
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
          >
            + Create Post
          </button>
        </div>
        <BlogPosts userId={userId} user={user} refreshKey={refreshKey} />
        {isFormOpen && (
          <CrudForm
            createPost={true}
            initialData={null}
            onSave={handleSavePost}
            onCancel={() => setIsFormOpen(false)}
          />
        )}
      </div>
    </div>
  );
}