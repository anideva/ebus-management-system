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
    <section className="recent-activity">
      <div className="recent-activity-header">
        <h2>Recent Activity</h2>
        {!loading && activities.length > 0 && (
          <span className="activity-count">{activities.length} recent</span>
        )}
      </div>

      <div className="activity-box">
        {loading ? (
          <div className="activity-loading">
            <span className="activity-spinner" aria-hidden="true" />
            <span>Loading recent activity...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="activity-empty">
            <div className="activity-empty-icon" aria-hidden="true">📋</div>
            <h3 className="activity-empty-title">No recent activity</h3>
            <p className="activity-empty-desc">
              When tickets, passes, or bus details are updated, activities will appear here.
            </p>
          </div>
        ) : (
          <div className="activity-list">
            {activities.map((activity, index) => (
              <div className="activity-item" key={activity._id || index}>
                <div className="activity-details">
                  <span className="activity-badge">{activity.type}</span>
                  <p className="activity-message">{activity.message}</p>
                </div>

                <span className="activity-time">
                  {activity.createdAt
                    ? new Date(activity.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentActivity;