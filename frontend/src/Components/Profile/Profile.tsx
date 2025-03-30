import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../Context/UserDataContext";
import "./Profile.css";

interface ProfileProps {
    Close: () => void;
}

function Profile({ Close }: ProfileProps) {
    const navigate = useNavigate();
    const [closing, setClosing] = useState(false);

    const userContext = useContext(UserData);
    if (!userContext) throw new Error("useContext(UserData) must be used within a UserContextProvider");

    const { user } = userContext;

    // Use fallback values to avoid errors if some properties are missing
    const profileImage = user?.profileImage || "/default-profile.jpg";
    const bannerImage = user?.bannerImage || "/default-banner.jpg";
    const fullName = user?.fullName || "Unknown User";
    const prn = user?.PRN || "N/A";
    const branch = user?.branch || "Not Specified";
    const shortBio = user?.shortBio || "No bio available.";

    function handleClose() {
        setClosing(true);
        setTimeout(() => Close(), 300); // Matches animation duration (0.3s)
    }

    return (
        <div className={`profile-overlay ${closing ? "fade-out" : "fade-in"}`} onClick={handleClose}>
            <div className={`profile-card ${closing ? "slide-out" : "slide-in"}`} onClick={(e) => e.stopPropagation()}>
                <img className="profile-card-banner" src={bannerImage} alt="Profile Banner" />

                <span className="material-icons profile-arrow">arrow_drop_up</span>
                <span className="material-icons profile-cancel-btn" onClick={handleClose}>close</span>

                <div className="profile-container">
                    <img src={profileImage} alt="Profile" />
                    <h1>{fullName}</h1>
                    <h2>PRN: {prn}</h2>
                    <h2>{branch}</h2>
                    <p>{shortBio}</p>
                    <a onClick={() => { navigate("/profile"); handleClose(); }}>View Profile</a>
                </div>
            </div>
        </div>
    );
}

export default Profile;
