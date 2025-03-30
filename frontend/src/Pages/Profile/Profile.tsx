import { useState, useEffect, useContext } from "react";
import { UserData } from "../../Context/UserDataContext";
import "./Profile.css";
import Footer from "../../Components/Footer/Footer";

interface GuardianInfo {
    name: string;
    relation: string;
    contact: string;
}

interface DocumentInfo {
    documentType: string;
    documentUrl: string;
}

function Profile() {
    const [panel, setPanel] = useState<"about" | "course" | "documents">("about");
    const userContext = useContext(UserData);
    
    if (!userContext) throw new Error("useContext(UserData) must be used within a UserContextProvider");

    const { user, updateUserData } = userContext;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!user?.username) return;

                const response = await fetch(`http://localhost:5000/api/profile/${user.username}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                if (!response.ok) throw new Error("Failed to fetch profile");

                const data = await response.json();
                updateUserData(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [user?.username, updateUserData]);

    function About() {
        return (
            <>
                <div className="page-base-container profilepg-about">
                    <h1>About Me</h1>
                    <h2>{user?.biotag || "No bio available"}</h2>
                    <p>{user?.longBio || "No biography available"}</p>
                    <div className="page-container-line-2" />
                    
                    {[
                        { key: "PRN", value: user?.PRN },
                        { key: "Branch", value: user?.branch },
                        { key: "Term", value: user?.term }
                    ].map((item) => (
                        <div key={item.key} className="profilepg-sub-container">
                            <h1>{item.key}</h1>
                            <h2>{item.value || "N/A"}</h2>
                        </div>
                    ))}
                </div>

                <div className="page-base-container profilepg-container">
                    <h1>More Information</h1>
                    <div className="page-container-line-1" />
                    {user?.moreInfo &&
                        Object.entries(user.moreInfo).map(([key, value]) => (
                            <div key={key} className="profilepg-sub-container">
                                <h1>{key.replace(/([A-Z])/g, " $1").trim()}</h1>
                                <h2>{String(value) || "N/A"}</h2>
                            </div>
                        ))}
                </div>

                <div className="page-base-container profilepg-container">
                    <h1>Student Address</h1>
                    <div className="page-container-line-1" />
                    {user?.studentAddress &&
                        Object.entries(user.studentAddress).map(([key, value]) => (
                            <div key={key} className="profilepg-sub-container">
                                <h1>{key.replace(/([A-Z])/g, " $1").trim()}</h1>
                                <h2>{String(value) || "N/A"}</h2>
                            </div>
                        ))}
                </div>

                <div className="page-base-container profilepg-container">
                    <h1>Parent/Guardian Information</h1>
                    <div className="page-container-line-1" />
                    {(user?.guardianInfo || []).map((guardian: GuardianInfo, index: number) => (
                        <div key={index}>
                            {Object.entries(guardian).map(([key, value]) => (
                                <div key={key} className="profilepg-sub-container">
                                    <h1>{key}</h1>
                                    <h2>{String(value) || "N/A"}</h2>
                                </div>
                            ))}
                            {index < user.guardianInfo.length - 1 && <div className="page-container-line-2" />}
                        </div>
                    ))}
                </div>
            </>
        );
    }

    function Documents() {
        const [openDocuments, setOpenDocuments] = useState<{ [key: string]: boolean }>({});

        return (
            <>
                {(user?.documents || []).map((doc: DocumentInfo, index: number) => (
                    <div key={index} className="page-base-container profilepg-container">
                        <h1>{doc.documentType}</h1>
                        <div className="page-container-line-1" />
                        {openDocuments[doc.documentType] && (
                            <>
                                <img src={doc.documentUrl} alt={doc.documentType} />
                                <div className="page-container-line-1" />
                            </>
                        )}
                        <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="material-icons">
                            open_in_new
                        </a>
                        <button onClick={() => setOpenDocuments(prev => ({
                            ...prev,
                            [doc.documentType]: !prev[doc.documentType]
                        }))}>
                            {openDocuments[doc.documentType] ? "Hide" : "Show"}
                        </button>
                    </div>
                ))}
            </>
        );
    }

    if (!user) return <div className="loading-container">Loading profile...</div>;

    return (
        <div className="page-container">
            <div className="page-main-container">
                <div className="profilepg-container-0">
                    <img className="profilepg-banner" src={user?.bannerImage || "/default-banner.jpg"} alt="Banner" />
                    <div className="profilepg-navbar">
                        <img src={user?.profileImage || "/default-profile.jpg"} alt="Profile" />
                        <h1>{user?.fullName || "Unknown User"}</h1>
                        <div className="profilepg-navbar-options">
                            <h2 className={panel === "about" ? "active" : ""} onClick={() => setPanel("about")}>About</h2>
                            <h2 className={panel === "course" ? "active" : ""} onClick={() => setPanel("course")}>Course</h2>
                            <h2 className={panel === "documents" ? "active" : ""} onClick={() => setPanel("documents")}>Documents</h2>
                        </div>
                    </div>
                </div>

                <div className="page-parent-base-container">
                    {panel === "about" && <About />}
                    {panel === "documents" && <Documents />}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Profile;
