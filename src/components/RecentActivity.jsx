import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { API_BASE_URL } from "../config/api";
import "../styles/recentActivity.css";

function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const response = await fetch(
          `${API_BASE_URL}/api/dashboard/recent-activity`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recent activity");
        }

        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="recent-activity">
      <h2>📋 Recent Activity</h2>

      <div className="activity-box">
        {loading ? (
          <p>Loading recent activity...</p>
        ) : activities.length === 0 ? (
          <p>No recent activity available.</p>
        ) : (
          activities.map((activity, index) => (
            <div className="activity-item" key={index}>
              <div>
                <strong>{activity.type}</strong>
                <p>{activity.message}</p>
              </div>

              <small>
                {new Date(activity.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentActivity;