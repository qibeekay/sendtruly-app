import React, { useEffect, useState } from "react";
import styles from "../forms.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { AxiosInstance } from "../../../config";
import OTPInput from "react-otp-input";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
function AuthForm({ form, userMail }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("data_user_main"))
  );

  const [loader, setLoader] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [country, setCountry] = useState("nigeria");
  const [otp, setOtp] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [address, setAddress] = useState("");
  const [otpLoader, setOtpLoader] = useState(false);

  const [show, setShow] = useState(false);

  // Sync localStorage with state
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data_user_main"));
    if (data) {
      setUserData(data);
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/auth/sign-up`,
        {
          mail: email,
          pword: password,
          confirm_password: password,
          country,
          fname: firstName,
          lname: lastName,
        }
      );
      setLoader(false);
      if (res.data.success) {
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate(`/verify/${email}`);
        }, 2000);
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoader(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/auth/login`,
        {
          mail: email,
          pword: password,
        }
      );
      setLoader(false);
      if (res.data.success) {
        toast({
          title: "Welcome Back.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        localStorage.setItem("data_user_main", JSON.stringify(res.data.data));
        setUserData(res.data.data); // Update state with new user data
        navigate("/dashboards");
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoader(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/auth/verify-user-otp`,
        {
          mail: userMail,
          otp,
        }
      );
      setLoader(false);
      if (res.data.success) {
        toast({
          title: "Email Verified!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        localStorage.setItem("data_user_main", JSON.stringify(res.data.data));
        setUserData(res.data.data);
        navigate("/dashboards");
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoader(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const sendPhoneOtp = async () => {
    if (!phone_number) {
      return;
    }
    setOtpLoader(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/kyc/request-otp`,
        {
          usertoken: userData.usertoken,
          phone_number,
        }
      );
      setOtpLoader(false);
      if (res.data.success) {
        toast({
          title: `Sent an OTP to ${phone_number}`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setOtpLoader(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const completeKyc = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/kyc/verify-kyc`,
        {
          usertoken: userData.usertoken,
          fullname: `${userData.fname} ${userData.lname}`,
          otp,
          phone_number,
          address,
        }
      );

      if (res.data.success) {
        getUserData();
      } else {
        setLoader(false);
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoader(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const getUserData = async () => {
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/profile/get-user-data`,
        {
          identifier: userData.usertoken,
        }
      );
      setLoader(false);
      if (res.data.success) {
        localStorage.setItem("data_user_main", JSON.stringify(res.data.data));
        toast({
          title: `Account Verified Successfully!`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        navigate(-1);
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoader(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const handleForgotPass = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/auth/forget-password`,
        {
          mail: email,
        }
      );
      setLoader(false);
      if (res.data.success) {
        toast({
          title: "Check your mail for more details!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setEmail("");
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoader(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const handleReset = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/auth/update-password`,
        {
          usertoken: userData.usertoken,
          fpword: oldPassword,
          npword: newPassword,
        }
      );
      setLoader(false);
      if (res.data.success) {
        toast({
          title: "Password Changed Successfully!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate("/login");
          localStorage.removeItem("data_user_main");
        }, 1000);
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setLoader(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (form === "register") {
    return (
      <div className={styles.auth_form_case}>
        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.form_item_case}>
            {" "}
            <div className={styles.form_item}>
              {" "}
              <label htmlFor="">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className={styles.form_item}>
              <label htmlFor="">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
          <div className={styles.form_item}>
            <label htmlFor="">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.form_item}>
            {" "}
            <label htmlFor="">Password</label>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  className={styles.eye_button}
                  onClick={() => setShow(!show)}
                >
                  {show ? <FaEye /> : <FaEyeSlash />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>
          <div className={styles.form_item}>
            <label htmlFor="">Country</label>
            <select
              name=""
              id=""
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="nigeria">Nigeria</option>{" "}
            </select>
          </div>
          <button>
            {loader ? <Spinner size="md" color="black" /> : "SIGN UP FOR FREE"}
          </button>{" "}
          <span className={styles.terms}>
            By signing up or otherwise using our services, you agree to be bound
            by our <span>Terms of Use</span> and <span>Privacy Policy</span>.
          </span>
        </form>{" "}
        <Link to="/login">
          Already have an account? <span>Login</span>
        </Link>
      </div>
    );
  } else if (form === "login") {
    return (
      <div className={styles.auth_form_case}>
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.form_item}>
            <label htmlFor="">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className={styles.form_item}>
            {" "}
            <label htmlFor="">Password</label>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  className={styles.eye_button}
                  onClick={() => setShow(!show)}
                >
                  {show ? <FaEye /> : <FaEyeSlash />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>
          <button>
            {" "}
            {loader ? <Spinner size="md" color="black" /> : "LOGIN"}
          </button>{" "}
          <span className={styles.terms}>
            Can't remember your password? <Link to="/forgot">Reset</Link>
          </span>
        </form>{" "}
        <Link to="/register">
          Don't have an account? <span>Register</span>
        </Link>
      </div>
    );
  } else if (form === "reset") {
    return (
      <form
        className={styles.form}
        style={{ background: "linear-gradient(to left, #fc2e63, #760025" }}
        onSubmit={handleReset}
      >
        <div className={styles.form_item}>
          {" "}
          <label htmlFor="">Old Password</label>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter your old password"
              required
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                className={styles.eye_button}
                onClick={() => setShow(!show)}
              >
                {show ? <FaEye /> : <FaEyeSlash />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </div>
        <div className={styles.form_item}>
          {" "}
          <label htmlFor="">New Password</label>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
          </InputGroup>
        </div>
        <div className={styles.form_item}>
          {" "}
          <label htmlFor="">Confirm Password</label>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
            />
          </InputGroup>
        </div>
        <Button type="submit" isLoading={loader} loadingText="RESETTING">
          RESET
        </Button>{" "}
      </form>
    );
  } else if (form === "kyc") {
    return (
      <div className={styles.auth_form_case} style={{ padding: "40px 0px" }}>
        <form className={styles.form} onSubmit={completeKyc}>
          <div className={styles.form_item}>
            <label>Full Name</label>
            <Input
              type="text"
              isDisabled={true}
              value={`${userData.fname} ${userData.lname}`}
              required
            />
          </div>
          <div className={styles.form_item}>
            <label>Email</label>
            <Input
              pr="4.5rem"
              type="email"
              isDisabled={true}
              value={userData.mail}
              required
            />
          </div>
          <div className={styles.form_item}>
            {" "}
            <label>Phone Number</label>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type="number"
                value={phone_number}
                onChange={(e) => setPhone_number(e.target.value)}
                placeholder="Enter phone number"
                required
              />
              <InputRightElement width="4.5rem">
                <Button
                  isLoading={otpLoader}
                  h="1.75rem"
                  size="sm"
                  onClick={sendPhoneOtp}
                >
                  Get OTP
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>
          <div className={styles.form_item}>
            <label>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to you"
              required
            />
          </div>
          <div className={styles.form_item}>
            <label>Address</label>
            <textarea
              type="text"
              placeholder="Enter your address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
          <Button type="submit" isLoading={loader} loadingText="Verifying">
            VERIFY
          </Button>{" "}
        </form>{" "}
      </div>
    );
  } else if (form === "forgotpassword") {
    return (
      <div className={styles.auth_form_case}>
        <form className={styles.form} onSubmit={handleForgotPass}>
          <div className={styles.form_item}>
            <label htmlFor="">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button>
            {" "}
            {loader ? <Spinner size="md" color="black" /> : "SEND EMAIL"}
          </button>{" "}
        </form>{" "}
        <Link to="/login">
          Go back to <span>Login</span>
        </Link>
      </div>
    );
  } else if (form === "verify") {
    return (
      <div className={styles.auth_form_case}>
        <form
          className={styles.form}
          onSubmit={handleVerify}
          style={{ marginTop: "15px" }}
        >
          <div className={styles.otp_form}>
            <OTPInput
              containerStyle={{
                display: "flex",
                justifyContent: "center",
                alignSelf: "center",
                width: "100%",
              }}
              value={otp}
              onChange={setOtp}
              inputType="number"
              numInputs={6}
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <button>
            {loader ? <Spinner size="md" color="black" /> : "VERIFY"}
          </button>{" "}
        </form>{" "}
        <Link to="/login">
          Go back to <span>Login</span>
        </Link>
      </div>
    );
  }
}

export default AuthForm;
