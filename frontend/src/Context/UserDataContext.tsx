import { createContext, ReactNode, useEffect, useState } from "react";

// Define the user data structure dynamically
interface UserContextType {
  [key: string]: any; // Allows dynamic keys including nested objects
}

// Default structure in case of errors
const defaultData: UserContextType = {
  username: "N/A",
  PRN: "N/A",
  fullName: "Not Loading",
  firstName: "N/A",
  lastName: "N/A",
  contact: "N/A",
  gmail: "N/A",
  branch: "N/A",
  term: "N/A",
  profileImage: "/Images/profile.png",
  bannerImage: "/Images/BG.png",
  biotag: "N/A",
  longBio: "N/A",
  shortBio: "N/A",
  moreInfo: {
    gender: "N/A",
    dateOfBirth: "N/A",
    bloodGroup: "N/A",
    phoneNo: "N/A",
    emergencyNo: "N/A",
    aadharNo: "N/A",
  },
  admissionDetails: {
    admissionType: "N/A",
    admissionStatus: "N/A",
    admissionDate: "N/A",
  },
  studentAddress: {
    permanentAddress: "N/A",
    currentAddress: "N/A",
    area: "N/A",
    landMark: "N/A",
    city: "N/A",
    pincode: "N/A",
    state: "N/A",
    country: "N/A",
  },
  guardianInfo: [],
  documents: [],
  isActive: false,
  createdAt: "",
  updatedAt: "",
};

// Function to fetch user data dynamically from MongoDB
const fetchUserData = async (): Promise<UserContextType> => {
  try {
    const response = await fetch("http://localhost:5000/api/userdata"); // Adjust API as needed
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return defaultData; // Fallback in case of errors
  }
};

// Define the User Context type
interface UserContextValue {
  user: UserContextType;
  updateUserData: (updatedUser: Partial<UserContextType>) => void;
}

// Create the context
export const UserData = createContext<UserContextValue | null>(null);

// Provider Component
export const UserContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserContextType>(() => {
    const storedUser = localStorage.getItem("UserData");
    return storedUser ? JSON.parse(storedUser) : defaultData;
  });

  useEffect(() => {
    if (!localStorage.getItem("UserData")) {
      fetchUserData().then((data) => {
        setUser(data);
        localStorage.setItem("UserData", JSON.stringify(data));
      });
    }
  }, []);

  // Function to update user data dynamically
  function updateUserData(updatedUser: Partial<UserContextType>) {
    setUser((prevUser) => {
      const newUserData = { ...prevUser, ...updatedUser };
      localStorage.setItem("UserData", JSON.stringify(newUserData));
      return newUserData;
    });
  }

  return (
    <UserData.Provider value={{ user, updateUserData }}>
      {children}
    </UserData.Provider>
  );
};
