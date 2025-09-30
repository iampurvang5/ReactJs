import { useState, useEffect, useContext  } from "react";
import { useNavigate } from "react-router-dom";
import CrudForm from "./CrudForm";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { AuthContext } from "../context/AuthContext";

export default function CrudTable({ user }) {
  const baseUrl = "http://192.168.1.5:3000/api";
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  console.log("User in CrudTable:", user);

  const [showPosts, setShowPosts] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Fetching users...");

      if (!user || !user.token) {
        setError("User not authenticated");
        setIsLoading(false);
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          baseUrl+"/users?fields=name,email,age,designation",
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`
            }
          }
        );
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setUser(null); // Clear user state
            navigate("/login");
            throw new Error("Authentication failed. Please log in again.");
          }
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        // Map API response to match the expected item structure
        const formattedData = data.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          designation: user.designation,
        }));
        setItems(formattedData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    };

    fetchUsers();
  }, [user, navigate, setUser]);

  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${baseUrl}/users/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        // Remove the user from local state
        setItems(items.filter((i) => i.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "The user has been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    }
  };

  const handleSave = async (data) => {
    if (editingItem) {
      try {
        const response = await fetch(
          `${baseUrl}/users/${editingItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        const updatedUser = await response.json();
        // Update the local state with the API response
        setItems(
          items.map((i) =>
            i.id === editingItem.id
              ? {
                  id: updatedUser._id,
                  name: updatedUser.name,
                  email: updatedUser.email,
                  age: updatedUser.age,
                  designation: updatedUser.designation || "N/A",
                }
              : i
          )
        );
        Swal.fire({
          title: "Updated!",
          text: "The user has been updated.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
        return; // Prevent closing the form on error
      }
    } else {
      // Create new user via API
      try {
        const response = await fetch(baseUrl+"/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error("Failed to create user");
        }
        const newUser = await response.json();
        // Add the new user to the local state
        setItems([
          ...items,
          {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            age: newUser.age,
            designation: newUser.designation || "N/A",
          },
        ]);
        Swal.fire({
          title: "Success!",
          text: "The user has been created.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
    }
    setIsFormOpen(false);
  };

  const handleViewPosts = (userId) => {
        navigate(`/posts/${userId}`);
    // setSelectedUserId(userId);
    // setShowPosts(true);
  };

  if (isLoading) {

    return <div className="p-6 text-center">Loading...</div>;

  }

    if (error) {

    return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  }

  const handleBack = () => {
    setShowPosts(false);
    setSelectedUserId(null);
  };

return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Users</h2>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800"
          >
            + Add User
          </button>
        </div>

        <div className="overflow-hidden rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-900 text-left text-white">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Age</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-indigo-50 hover:text-blue-900 bg-indigo-100"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.age}</td>
                  <td className="p-3">{u.designation}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-3 py-1 bg-blue-600 text-white rounded mr-2 hover:bg-blue-800 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded mr-2 hover:bg-red-800 rounded-lg"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleViewPosts(u.id)}
                      className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-800 rounded-lg"
                    >
                      View Posts
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-3 text-center text-blue-900"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isFormOpen && (
          <CrudForm
            createPost={false}
            initialData={editingItem}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        )}
      </div>
    </div>
  );

}
