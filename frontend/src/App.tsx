import { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation  } from "react-router-dom";
import { AlertSystemContext } from "./Components/Alert/AlertSystem";
import { UserData  } from "./Context/UserDataContext";
import "./App.css";

import BG from "./BG/BG";
import Navigation from "./Components/Navigation/Navigation";
import L_Navigation from "./Components/L_Navigation";

import Page_Not_Found from "./Pages/Page_Not_Found/Page_Not_Found";
import _Landing from "./Pages/_Landing/Landing";
import Login from "./Pages/Login/Login";
import Policy from "./Pages/Policy_&_Conditions/Policy_&_Conditions"
import Dashboard from "./Pages/Dashboard/Dashboard";
import Profile from "./Pages/Profile/Profile";
import Attendance from "./Pages/Attendance/Attendance";
import Course from "./Pages/Course/Course";
import Calendar from "./Pages/Calendar/Calendar";
import Time_Table from "./Pages/Time_Table/Time_Table";
import Circulars from "./Pages/Circulars/Circulars";
import Notifications from "./Pages/Notifications/Notifications";

import Faculty_Attendance from "./Pages/Faculty/Attendance/Attendance";

import Admin_Circulars from "./Pages/Admin/Circulars/Circulars";
import Admin_TT from "./Pages/Admin/Time_Table/Time_Table";



function Layout() {
  const userContext = useContext(UserData);
  if (!userContext) throw new Error("useContext(UserData) must be used within a UserContextProvider");
  const { user } = userContext;
  
  const Role = user?.Role;

  const AlertSystem = useContext(AlertSystemContext);
  const location = useLocation();


  // Protected pages for student
  const studentRoutes = [
    { name: "Dashboard",     icon: "dashboard",     path: "/dashboard",     component: <Dashboard />,     status: "active" },
    { name: "Profile",       icon: "person",        path: "/profile",       component: <Profile />,       status: "active" },
    { name: "Attendance",    icon: "check_circle",  path: "/attendance",    component: <Attendance />,    status: "active" },
    { name: "Calendar",      icon: "event",         path: "/calendar",      component: <Calendar />,      status: "active" },
    { name: "Time Table",    icon: "schedule",      path: "/timetable",     component: <Time_Table />,    status: "active" },
    { name: "Course",        icon: "menu_book",     path: "/course",        component: <Course />,        status: "active" },
    { name: "Result",        icon: "bar_chart",     path: "/result",        component: <Course />,        status: "active" },
    { name: "Circulars",     icon: "campaign",      path: "/circulars",     component: <Circulars />,     status: "hidden" },
    { name: "Notifications", icon: "notifications", path: "/notifications", component: <Notifications />, status: "hidden" },
  ];

  // Protected pages for faculty
  const facultyRoutes = [
    { name: "Dashboard",     icon: "dashboard",     path: "/dashboard",     component: <Dashboard />,     status: "active" },
    { name: "Profile",       icon: "person",        path: "/profile",       component: <Profile />,       status: "active" },
    { name: "Attendance",    icon: "check_circle",  path: "/attendance",    component: <Faculty_Attendance />,    status: "active" },
    { name: "Calendar",      icon: "event",         path: "/calendar",      component: <Calendar />,      status: "active" },
    { name: "Time Table",    icon: "schedule",      path: "/timetable",     component: <Time_Table />,    status: "active" },
    { name: "Circulars",     icon: "campaign",      path: "/circulars",     component: <Circulars />,     status: "hidden" },
    { name: "Notifications", icon: "notifications", path: "/notifications", component: <Notifications />, status: "hidden" },
  ];

  // Protected pages for admin
  const adminRoutes = [
    { name: "Dashboard",     icon: "dashboard",     path: "/dashboard",     component: <Dashboard />,        status: "active" },
    { name: "Calendar",      icon: "event",         path: "/calendar",      component: <Admin_Circulars />, status: "active" },
    { name: "Time Table",    icon: "schedule",      path: "/timetable",     component: <Admin_TT />, status: "active" },
    { name: "Circulars",     icon: "campaign",      path: "/circulars",     component: <Admin_Circulars />, status: "active" },
    { name: "Notifications", icon: "notifications", path: "/notifications", component: <Admin_Circulars />, status: "hidden" },
  ];

  const protectedRoutes = Role === "admin" ? adminRoutes : Role === "faculty" ? facultyRoutes : studentRoutes;


  // Remove component from protectedRoutes & save rest in savedRoutes
  const savedRoutes = protectedRoutes.map(({ component, ...rest }) => rest);
  localStorage.setItem("protectedRoutes", JSON.stringify(savedRoutes));


  // all available routes 
  const allRoutes: { [key: string]: string } = {
    landing: "/",

    login: "/login",

    policy: "/privacy-policy",
    conditions: "/terms-&-conditions",
  };

  // Add protectedRoutes to routes
  protectedRoutes.forEach((route) => {
    const key = route.name;
    allRoutes[key] = route.path;
  });
  
  
  // Convert to a Set for quick lookup
  const knownRoutes = new Set(Object.values(allRoutes));


  // useState to check on which type of page user is
  const [onUnknown, setOnUnknown] = useState(false);
  const [onLanding, setOnLanding] = useState(false);
  const [onLogin, setOnLogin] = useState(false);
  const [onPolicy, setOnPolicy] = useState(false);
  

  // Update states when route changes
  useEffect(() => {
    setOnUnknown(!knownRoutes.has(location.pathname));   // if user is on unknown page set onUnknown to true
    setOnLanding(location.pathname === allRoutes.landing); // check if user is on landg page if yes set onLanding to true
    setOnLogin(location.pathname === allRoutes.login);    // check if user is on landg page if yes set onLogin to true
    setOnPolicy(                                      // check if user is on privacy-policy or terms-&-conditions page if yes set onPolicy to true
      location.pathname === allRoutes.policy || 
      location.pathname === allRoutes.conditions
    );
  }, [location.pathname]);


  // Check if user is loggedin
  function CheckLogin({ element }: { element: React.ReactElement }) {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true"; // Read from localStorage
  
    if (!isLoggedIn) {
      //AlertSystem?.showAlert("Please login first", "warning", 5);
      console.log("Please login first")
    }

    // If not loggedin redirect to login page and show alert
    if (!isLoggedIn) {
      return <Navigate to={allRoutes.login} state={{ from: location.pathname }} />;
      // navigate to login & set state.from to the url of page user is trying to access 
      // this state.from variable is used to set fallback after login
      // for eg if user goes to login page from landing page, after login he will come back to landing page
      // similarly if user goes to or is redirected to login page from any protected page after login he will go to the same page he came from
    }
    
    // else return element
    return element;
  }

  
  return (
    <>
      {/* Show Navigation & BG for Landing Page only */}
      {onLanding && <><L_Navigation /></>}

      {/* Show Navigation & BG for Protected Pages only */}
      {(!onLanding && !onLogin && !onPolicy && !onUnknown) && <><Navigation /><BG /></>}

      <Routes>
        {/* Landing page */}
        <Route path={allRoutes.landing} element={<_Landing />} />
        
        {/* Login page */}
        <Route path={allRoutes.login} element={<Login />} />
                
        {/* privacy-policy & terms-&-conditions */}
        <Route path={allRoutes.policy} element={<Policy />} />
        <Route path={allRoutes.conditions} element={<Policy />} />

        {/* Protected pages */}
        {protectedRoutes.map(({ name, path, component }) => (
          <Route
            key={name}
            path={path}
            element={<CheckLogin element={component} />}
          />
        ))}

        {/* Unknown  Page */}
        <Route path="*" element={<Page_Not_Found />} />
      </Routes>
    </>
  );
}



function App() { 
  return (
    <>
      <Router>
        <Layout />
      </Router>
    </>
  );
}

export default App;
