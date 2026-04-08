import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Vehicles.css";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 🚀 FETCH VEHICLES
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/vehicles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }

        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [navigate]);

  // 🗑️ DELETE FUNCTION
  const handleDelete = async (licensePlate) => {
    if (!window.confirm(`Delete vehicle ${licensePlate}?`)) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/delete-vehicle/${licensePlate}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed");
      }

      // ✅ update UI
      setVehicles((prev) =>
        prev.filter((v) => v.LicensePlate !== licensePlate),
      );

      alert("Vehicle deleted");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ⏳ LOADING
  if (loading) {
    return <div className="vehicles-container">Loading...</div>;
  }

  // ❌ ERROR
  if (error) {
    return (
      <div className="vehicles-container">
        <h2>Registered Vehicles</h2>
        <p>{error}</p>
      </div>
    );
  }

  // ✅ UI
  return (
    <div className="vehicles-container">
      <h2 className="vehicles-title">Registered Vehicles</h2>

      <table className="vehicles-table">
        <thead>
          <tr>
            <th>Owner</th>
            <th>License Plate</th>
            <th>Vehicle Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No vehicles found
              </td>
            </tr>
          ) : (
            vehicles.map((v) => (
              <tr key={v.VehicleID}>
                <td>{v.OwnerName}</td>
                <td>{v.LicensePlate}</td>
                <td>{v.VehicleType}</td>

                <td>
                  {/* ✅ ALWAYS SHOW BUTTON */}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(v.LicensePlate)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Vehicles;
