import { useState, useEffect } from "react";
import Swal from 'sweetalert2/dist/sweetalert2.js'; //npm install sweetalert2
import 'sweetalert2/src/sweetalert2.scss';

export default function BlogPosts({ userId,user,refreshKey }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = "http://192.168.1.5:3000/api";

  const isValidImageUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    // Basic URL pattern check for http or https
    const urlPattern = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp|bmp)(\?.*)?$/i;
    return urlPattern.test(url);
  };
  // Fetch posts from the API when userId changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${baseUrl}/posts/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`
            }
          }
        );
        console.log("response===>",response);
        if (!response.ok) {
            if(response.status === 404){
                // data.posts = [];
            }else{
                throw new Error('Failed to fetch posts');
            }
        }
        const data = await response.json();
        console.log("Fetched posts:", data);
        var formattedPosts = [];
        if(data.posts){
            // Map API response to match the expected post structure
            formattedPosts = data.posts.map(post => ({
            id: post._id,
            title: post.title,
            description: post.description,
            image: isValidImageUrl(post.imageurl)
                ? post.imageurl
                : 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg'
            }));
        }
        setPosts(formattedPosts);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonColor: '#3085d6'
        });
      }
    };

    if (userId) {
      fetchPosts();
    }
  }, [userId,refreshKey]);

  return (
    <div className="bg-indigo-100 min-h-screen p-6 rounded-xl">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Posts
        </h2>
        {isLoading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">Error: {error}</div>
        ) : posts.length === 0 ? (
          <h2 className="text-center text-gray-600">No posts found for this user.</h2>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {post.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}