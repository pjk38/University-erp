import { useState, useEffect, useContext } from "react";
import { UserData } from "../../Context/UserDataContext";
import "./Profile.css";
import Footer from "../../Components/Footer/Footer";



// type def for UserData
interface UserDataType {
    Key: string;
    Value: string;
}
interface ParentType {
    parentDetails: UserDataType[];
}


const dataLoading = [
    { Key: "loading", Value: "" },
];
const dataNotLoading = [
    { Key: "error", Value: "N/A" },
];
  
  
const fetchData = async (key: string, src: string) => {
    try {
        // Simulate server delay in  ms
        await new Promise(resolve => setTimeout(resolve, 0));

        const response = await fetch(src);
        const data = await response.json();

        // Check if the response status is OK
        if (!response.ok) {
            console.error("Error:", response.status, data.message);
            const returnData = [
                { Key: "error", Value: data.message },
            ];
            return returnData;
        }
    
        // update localStorage
        localStorage.setItem(key, JSON.stringify(data));

        return data;  
    }
    catch (error) {
        console.error(`Error fetching data for ${key}:`, error);

        // Fallback in case of errors
        return dataNotLoading;
    }
};


function Profile() {
    const [panel, setPanel] = useState("about");

    const userContext = useContext(UserData);
    if (!userContext) throw new Error("useContext(UserData) must be used within a UserContextProvider");
    const { user, updateUserData } = userContext;
    
    let Profile = user?.Profile;
    let Banner = user?.Banner;
    let FullName = user?.FullName;
    let LongBio = user?.LongBio;
    let Biotag = user?.Biotag;


    // initialise constants for UserDta, ( key: localStorage-key , src: api-endpoint )
    const [UserDocuments, setUserDocuments] = useState(
        getData("UserDocuments", "http://localhost:5000/api/documents/")
    );
    const [UserAbout, setUserAbout] = useState(
        getData("UserAbout", "http://localhost:5000/api/about/")
    );
    const [UserMoreInfo, setUserMoreInfo] = useState(
        getData("UserMoreInfo", "http://localhost:5000/api/moreinfo/")
    );
    const [UserAddress, setUserAddress] = useState(
        getData("UserAddress", "http://localhost:5000/api/address/")
    );
    const [UserParentInfo, setUserParentInfo] = useState(
        getData("UserParentInfo", "http://localhost:5000/api/parentinfo/")
    );



    // getData from localStorage if stored else fetch from API
    function getData(key: string, src: string) {
        // get username from localStorage & add it to src 
        const username = localStorage.getItem('username');
        src += username;


        // function to call fetchData
        function callFetch() {
            fetchData(key, src).then((data) => {
                // determine which variable to update
                if (key === "UserDocuments") setUserDocuments(data);
                if (key === "UserAbout") setUserAbout(data);
                if (key === "UserMoreInfo") setUserMoreInfo(data);
                if (key === "UserAddress") setUserAddress(data);
                if (key === "UserParentInfo") setUserParentInfo(data);
            });
        }

        try {
            const data = localStorage.getItem(key);
            if (data) {
                return JSON.parse(data);
            }
            else {
                callFetch();
                return dataLoading;
            }
        }
        catch (error) {
            console.error(`Error parsing localStorage "${key}":`, error);
            return dataNotLoading;
        }
    };

    
    function About() {    
        return (
            <>
                {/* Content panel 1 */}
                <div className="page-base-container profilepg-about">
                    <h1>About Me</h1>
                    <h2>{Biotag}</h2>
                    <p>{LongBio}</p>
                    
                    <div className="page-container-line-2"/>
                    {(() => {
                        const loading = (UserAbout[0].Key === "loading");
                        const error = (UserAbout[0].Key === "error");
                        const message = UserAbout[0].Value;
                        
                        if (loading || error) {
                            return (
                                <div className="profilepg-sub-container">
                                    {loading && <h1 className="!mb-1">{"Loading..."}</h1>}
                                    {error && <h1 className="!mb-1">{"Error"}</h1>}
                                    {error && <h3 className="!mb-1">{message}</h3>}
                                    <div />
                                </div>
                            );
                        }
                        else {
                            return UserAbout.map((item: UserDataType) => (
                                <div key={item.Key} className="profilepg-sub-container">
                                    <h1>{item.Key}</h1>
                                    <h2>{item.Value}</h2>
                                    <div />
                                </div>
                            ));
                        }
                    })()}
                </div>
    
    
                {/* Content panel 2 */}
                <div className="page-base-container profilepg-container">
                    <h1>More Information</h1>
                    <div className="page-container-line-1"/>
                    {(() => {
                        const loading = (UserMoreInfo[0].Key === "loading");
                        const error = (UserMoreInfo[0].Key === "error");
                        const message = UserMoreInfo[0].Value;
                        
                        if (loading || error) {
                            return (
                                <div className="profilepg-sub-container">
                                    {loading && <h1 className="!mb-2.5">{"Loading..."}</h1>}
                                    {error && message!="N/A" &&
                                        <>
                                            <h1 className="!mb-2.5">{"Error"}</h1>
                                            <h2 className="!mb-2.5">{message}</h2>
                                        </>
                                    }
                                    {error && message=="N/A" &&
                                        <>
                                            <h1 className="!mb-2.5">{"RIP Server 💀"}</h1>
                                            <h2 className="!mb-2.5">{"死"}</h2>
                                        </>
                                    }
                                    <div />
                                </div>
                            );
                        }
                        else {
                            return UserMoreInfo.map((item: UserDataType) => (
                                <div key={item.Key} className="profilepg-sub-container">
                                    <h1>{item.Key}</h1>
                                    <h2>{item.Value}</h2>
                                    <div />
                                </div>
                            ));
                        }
                    })()}
                </div>
    
    
                {/* Content panel 3 */}
                <div className="page-base-container profilepg-container">
                    <h1>Student Address</h1>
                    <div className="page-container-line-1"/>
                    {(() => {
                        const loading = (UserAddress[0].Key === "loading");
                        const error = (UserAddress[0].Key === "error");
                        const message = UserAddress[0].Value;
                        
                        if (loading || error) {
                            return (
                                <div className="profilepg-sub-container">
                                    {loading && <h1 className="!mb-2.5">{"Loading..."}</h1>}
                                    {error && <h1 className="!mb-2.5">{"Error"}</h1>}
                                    {error && <h3 className="!mb-2.5">{message}</h3>}
                                    <div />
                                </div>
                            );
                        }
                        else {
                            return UserAddress.map((item: UserDataType) => (
                                <div key={item.Key} className="profilepg-sub-container">
                                    <h1>{item.Key}</h1>
                                    <h2>{item.Value}</h2>
                                    <div />
                                </div>
                            ));
                        }
                    })()}
                </div>
    
    
                {/* Content panel 4 */}
                <div className="page-base-container profilepg-container">
                    <h1>Parent/Guardian Information</h1>
                    <div className="page-container-line-1"/>
                    {(() => {
                        const loading = (UserParentInfo[0].Key === "loading");
                        const error = (UserParentInfo[0].Key === "error");
                        const message = UserParentInfo[0].Value;

                        if (loading || error) {
                            return (
                                <div className="profilepg-sub-container">
                                    {loading && <h1 className="!mb-2.5">{"Loading..."}</h1>}
                                    {error && <h1 className="!mb-2.5">{"Error"}</h1>}
                                    {error && <h3 className="!mb-2.5">{message}</h3>}
                                    <div />
                                </div>
                            );
                        }
                        else {
                            return(
                                <>
                                    {UserParentInfo.map((parent: ParentType, index: number) => (
                                        
                                        <div key={index}>
                                            {index !== 0 && <div className="page-container-line-2 !mt-1" />}

                                            {parent.parentDetails.map((item: UserDataType) => (
                                                <div key={item.Key} className="profilepg-sub-container">
                                                    <h1>{item.Key}</h1>
                                                    <h2>{item.Value}</h2>
                                                    <div />
                                                </div>
                                            ))}
                                        </div>

                                    ))}
                                </>
                            );
                        }
                    })()}
                </div>
            </>
        );
    }    

    function Cource() {    
        return (
            <>
                {/* Content panel 1 */}
                <div className="page-base-container profilepg-about">
                    <h1>Cource</h1>
                    <h2>{Biotag}</h2>
                    <p>{LongBio}</p>
                    
                    <div className="page-container-line-2"/>
                    {(() => {
                        const loading = (UserAbout[0].Key === "loading");
                        const error = (UserAbout[0].Key === "error");
                        const message = UserAbout[0].Value;
                        
                        if (loading || error) {
                            return (
                                <div className="profilepg-sub-container">
                                    {loading && <h1 className="!mb-1">{"Loading..."}</h1>}
                                    {error && <h1 className="!mb-1">{"Error"}</h1>}
                                    {error && <h3 className="!mb-1">{message}</h3>}
                                    <div />
                                </div>
                            );
                        }
                        else {
                            return UserAbout.map((item: UserDataType) => (
                                <div key={item.Key} className="profilepg-sub-container">
                                    <h1>{item.Key}</h1>
                                    <h2>{item.Value}</h2>
                                    <div />
                                </div>
                            ));
                        }
                    })()}
                </div>
    
    
                {/* Content panel 2 */}
                <div className="page-base-container profilepg-container">
                    <h1>More Information</h1>
                    <div className="page-container-line-1"/>
                    {(() => {
                        const loading = (UserMoreInfo[0].Key === "loading");
                        const error = (UserMoreInfo[0].Key === "error");
                        const message = UserMoreInfo[0].Value;
                        
                        if (loading || error) {
                            return (
                                <div className="profilepg-sub-container">
                                    {loading && <h1 className="!mb-2.5">{"Loading..."}</h1>}
                                    {error && message!="N/A" &&
                                        <>
                                            <h1 className="!mb-2.5">{"Error"}</h1>
                                            <h2 className="!mb-2.5">{message}</h2>
                                        </>
                                    }
                                    {error && message=="N/A" &&
                                        <>
                                            <h1 className="!mb-2.5">{"RIP Server 💀"}</h1>
                                            <h2 className="!mb-2.5">{"死"}</h2>
                                        </>
                                    }
                                    <div />
                                </div>
                            );
                        }
                        else {
                            return UserMoreInfo.map((item: UserDataType) => (
                                <div key={item.Key} className="profilepg-sub-container">
                                    <h1>{item.Key}</h1>
                                    <h2>{item.Value}</h2>
                                    <div />
                                </div>
                            ));
                        }
                    })()}
                </div>
    
    
                {/* Content panel 3 */}
                <div className="page-base-container profilepg-container">
                    <h1>Student Address</h1>
                    <div className="page-container-line-1"/>
                    {(() => {
                        const loading = (UserAddress[0].Key === "loading");
                        const error = (UserAddress[0].Key === "error");
                        const message = UserAddress[0].Value;
                        
                        if (loading || error) {
                            return (
                                <div className="profilepg-sub-container">
                                    {loading && <h1 className="!mb-2.5">{"Loading..."}</h1>}
                                    {error && <h1 className="!mb-2.5">{"Error"}</h1>}
                                    {error && <h3 className="!mb-2.5">{message}</h3>}
                                    <div />
                                </div>
                            );
                        }
                        else {
                            return UserAddress.map((item: UserDataType) => (
                                <div key={item.Key} className="profilepg-sub-container">
                                    <h1>{item.Key}</h1>
                                    <h2>{item.Value}</h2>
                                    <div />
                                </div>
                            ));
                        }
                    })()}
                </div>
    
    
                {/* Content panel 4 */}
                <div className="page-base-container profilepg-container">
                    <h1>Parent/Guardian Information</h1>
                    <div className="page-container-line-1"/>
                    {(() => {
                        const loading = (UserParentInfo[0].Key === "loading");
                        const error = (UserParentInfo[0].Key === "error");
                        const message = UserParentInfo[0].Value;

                        if (loading || error) {
                            return (
                                <div className="profilepg-sub-container">
                                    {loading && <h1 className="!mb-2.5">{"Loading..."}</h1>}
                                    {error && <h1 className="!mb-2.5">{"Error"}</h1>}
                                    {error && <h3 className="!mb-2.5">{message}</h3>}
                                    <div />
                                </div>
                            );
                        }
                        else {
                            return(
                                <>
                                    {UserParentInfo.map((parent: ParentType, index: number) => (
                                        
                                        <div key={index}>
                                            {index !== 0 && <div className="page-container-line-2 !mt-1" />}

                                            {parent.parentDetails.map((item: UserDataType) => (
                                                <div key={item.Key} className="profilepg-sub-container">
                                                    <h1>{item.Key}</h1>
                                                    <h2>{item.Value}</h2>
                                                    <div />
                                                </div>
                                            ))}
                                        </div>

                                    ))}
                                </>
                            );
                        }
                    })()}
                </div>
            </>
        );
    }  

    function Documents() {  
        const [openDocuments, setOpenDocuments] = useState<{ [key: string]: boolean }>({});

        function toggleDocument(key: string) {
            setOpenDocuments(prev => ({
                ...prev,
                [key]: !prev[key] // Toggle the visibility of the clicked document
            }));
        }
        
        
        return (
            <>
                {(() => {
                    const loading = (UserDocuments[0].Key === "loading");
                    const error = (UserDocuments[0].Key === "error");
                    console.log(loading,error)
                    if (loading || error) {
                        return(
                            <div className="page-base-container profilepg-container">
                                {loading && <h1>User Documents Loading...</h1>}
                                {error && <h1>Error</h1>}
                                <div className="page-container-line-1"/>
                                {loading && <span>Fetching data</span>}
                                {error && <span>Fetching failed</span>}
                            </div>
                        );
                    }
                    else {
                        return UserDocuments.map((item: UserDataType) => (
                            <div key={item.Key} className="page-base-container profilepg-container">
                                <h1>{item.Key}</h1>
                                <div className="page-container-line-1"/>
        
                                {openDocuments[item.Key] && (
                                    <>
                                      <img src={item.Value} alt={item.Key} />
                                      <div className="page-container-line-1"/>
                                    </>
                                )}
                                
                                <a href={item.Value} target="_blank" rel="noopener noreferrer" className="material-icons">open_in_new</a>
                                <span onClick={() => toggleDocument(item.Key)} >
                                    { openDocuments[item.Key]
                                    ? "Hide"
                                    : "Show"
                                } </span>
                            </div>
                        ))
                    }
                })()}
            </>
        );
    }        



    return (
        <div className="page-container">
            <div className="page-main-container">
                <div className="profilepg-container-0">
                    <img className="profilepg-banner" src={Banner}></img>
                    {/* Profile & navigation panel */}
                    <div className="profilepg-navbar">
                        <img src={Profile} />
                        <h1>{FullName}</h1>
                        <div className="profilepg-navbar-options">
                            <h2 className={panel === "about" ? "active" : ""} onClick={() => setPanel("about")}>About</h2>
                            <h2 className={panel === "cource" ? "active" : ""} onClick={() => setPanel("cource")}>Cource Progress</h2>
                            <h2 className={panel === "documents" ? "active" : ""} onClick={() => setPanel("documents")}>Documents</h2>
                        </div>
                        <span className="material-icons">more_vert</span>
                    </div>
                </div>

                {/* Content panel */}
                <div className="page-parent-base-container">
                    
                    {panel === "about" // if panel = about then render About panel
                    ? <About />

                    : panel === "cource"  // if panel = cource then render Cource panel
                    ? <Cource />

                    // else render Documents panel
                    : <Documents />
                    }

                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;
