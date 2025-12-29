import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Truck } from "lucide-react";
import "./deliver.css";
import { createDelivery, checkForMatch } from "../api";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

const Deliver = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      setError("You must be logged in to offer a delivery");
      return;
    }
    try {
      setIsLoading(true);
      console.log("Submitting delivery with data:", formData.restaurant);
      const response = await createDelivery({
        restaurantId: formData.restaurant,
      });
      console.log("Create delivery response:", response);

      const matchResult = await checkForMatch();
      console.log("Match result:", matchResult);

      if (matchResult && matchResult.match) {
        navigate(`/chat/${matchResult.match.id}`);
      } else {
        navigate("/match-waiting", {
          state: { type: "delivery", id: response.delivery.id },
        });
      }
    } catch (error) {
      console.error("Error submitting delivery offer:", error);
      setError(
        error.response?.data?.error || "Failed to submit delivery offer"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="deliver-container">
      <h1>Offer Delivery</h1>
      <div className="order-card">
        <form onSubmit={handleSubmit} className="order-details">
          <div className="deliver-details">
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
              <option value="1">Rishabs</option>
              <option value="2">Aswins</option>
              <option value="3">Main Canteen</option>
              <option value="4">PR Food</option>
              <option value="5">Laugh and Joy</option>
            </select>
          </div>
          <button type="submit" className="accept-btn">
            Offer Delivery
          </button>
        </form>
      </div>
    </div>
  );
};

export default Deliver;
