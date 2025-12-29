import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import "./request.css";
import { createRequest, checkForMatch } from "../api";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

const Request = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: "",
    restaurant: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to submit a request");
      return;
    }
    try {
      setIsLoading(true);
      const response = await createRequest({
        restaurantId: formData.restaurant,
      });
      console.log("Create request response:", response);

      const matchResult = await checkForMatch();
      console.log("Match result:", matchResult);

      if (matchResult && matchResult.match) {
        navigate(`/chat/${matchResult.match.id}`);
      } else {
        navigate("/match-waiting", {
          state: { type: "request", id: response.request.id },
        });
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setError(error.response?.data?.error || "Failed to submit food request");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="card-title">Request Food Delivery</h3>
          <p className="card-description">Submit a food delivery request</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-1"
              >
                Your Location
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Location</option>
                <option value="SSN">SSN</option>
                <option value="SNU">SNU</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="restaurant"
                className="block text-sm font-medium mb-1"
              >
                Restaurant
              </label>
              <select
                id="restaurant"
                name="restaurant"
                value={formData.restaurant}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Restaurant</option>
                <option value="2">Aswins</option>
                <option value="1">Rishabs</option>
                <option value="3">Main Canteen</option>
                <option value="4">PR food court</option>
                <option value="5">Laugh and Joy</option>
              </select>
            </div>
            <button type="submit" className="button">
              <Search className="mr-2 h-4 w-4" /> Submit Request
            </button>
          </form>
        </div>
      </div>
      {activeOrder && (
        <div className="active-order">
          <h3>Your Active Order</h3>
          <p>Order ID: {activeOrder.id}</p>
          <Link to={`/chat/${activeOrder.id}`} className="chat-btn">
            Chat with Deliverer
          </Link>
        </div>
      )}
    </div>
  );
};

export default Request;
