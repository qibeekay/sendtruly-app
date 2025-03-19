import { Route, Routes } from "react-router-dom";
import Landing from "./pages/unauthenticated/landing/Landing";
import Login from "./pages/unauthenticated/login/Login";
import Register from "./pages/unauthenticated/register/Register";
import ForgotPassword from "./pages/unauthenticated/forgotPass/ForgotPassword";
import About from "./pages/unauthenticated/about/About";
import Verify from "./pages/unauthenticated/verify/Verify";

// Authenticated
import Dashboard from "./pages/authenticated/dashboard/Dashboard";
import Sms from "./pages/authenticated/sms/Sms";

import "./App.css";
import Chats from "./pages/authenticated/chats/Chats";
import Contact from "./pages/authenticated/contact/Contact";
import History from "./pages/authenticated/history/History";
import Docs from "./pages/authenticated/docs/Docs";
import Settings from "./pages/authenticated/settings/Settings";
import Kyc from "./pages/authenticated/kyc/Kyc";
import { RefreshProvider } from "./utility/RefreshContext";
import Enterprise from "./pages/authenticated/enterprise/Enterprise";
import { TabProvider } from "./utility/TabContext";
import Compose from "./pages/authenticated/enterprise-compose/Compose";
import ReviewsPage from "./pages/unauthenticated/reviews/ReviewsPage";
import ViewStats from "./pages/authenticated/enterprise/ViewStats";
import TextTwopay from "./pages/unauthenticated/text2pay/TextTwopay";

function App() {
  return (
    <Routes>
      {/* Unauthenticated Routes  */}
      <Route element={<Landing />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<ForgotPassword />} path="/forgot" />
      <Route element={<Verify />} path="/verify/:email" />
      <Route element={<Register />} path="/register" />
      <Route element={<About />} path="/about" />
      <Route element={<ReviewsPage />} path="/reviews/:reviewId" />
      <Route element={<TextTwopay />} path="/invoice/:token" />

      {/* Authenticated ROutes  */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/sms" element={<Sms />} />
      <Route path="/dashboard/chats" element={<Chats />} />
      <Route
        path="/dashboard/contacts"
        element={
          <RefreshProvider>
            <Contact />
          </RefreshProvider>
        }
      />
      <Route path="/dashboard/history" element={<History />} />
      <Route path="/dashboard/api-doc" element={<Docs />} />
      <Route path="/dashboard/settings" element={<Settings />} />
      <Route
        path="/dashboard/enterprise/dashboard"
        element={
          <TabProvider>
            <Enterprise />
          </TabProvider>
        }
      />
      <Route
        path="/dashboard/enterprise/compose"
        element={
          <TabProvider>
            <Compose />
          </TabProvider>
        }
      />
      <Route path="/dashboard/enterprise/:token" element={<ViewStats />} />

      {/* Verifications  */}
      <Route path="/kyc/:usertoken" element={<Kyc />} />
    </Routes>
  );
}

export default App;
