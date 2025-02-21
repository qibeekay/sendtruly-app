import React from "react";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import {
  Box,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import styles from "./settings.module.css";
import AuthForm from "../../../components/forms/auth/AuthForm";

function Settings() {
  const userData = JSON.parse(localStorage.getItem("data_user_main"));

  const fullname = userData.fname + " " + userData.lname;
  const email = userData.mail;
  const phone = userData.phone;

  function capitalizeFirstLetter(inputString) {
    // Check if the input is a valid string
    if (typeof inputString !== "string" || inputString.length === 0) {
      return "Invalid input";
    }

    // Extract the first letter and capitalize it
    const firstLetter = inputString.charAt(0).toUpperCase();

    return firstLetter;
  }

  return (
    <DashboardLayout pageName={"Settings"}>
      <Tabs variant="soft-rounded" mt="15px">
        <TabList>
          <Tab>Personal info</Tab>
          <Tab>Security</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box
              d="flex"
              alignItems="flex-start"
              justifyContent="space-between"
              className={styles.profile_container}
            >
              <Box
                d="flex"
                alignItems="flex-start"
                justifyContent="flex-start"
                className={styles.profile_container_right}
              >
                <Box
                  d="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  className={styles.profile_case}
                >
                  <Box className={styles.profile_image_case}>
                    <Box className={styles.profiletopcase}>
                      <Box className={styles.profile_coverimg}>
                        <Box className={styles.profileimg}>
                          {capitalizeFirstLetter(userData.fname)}
                          {capitalizeFirstLetter(userData.lname)}
                        </Box>
                      </Box>
                    </Box>
                    {/* <h4>Personal Info</h4> */}
                    <div className={styles.profilebottomcase}>
                      <div className={styles.profileflexcase}>
                        <label htmlFor="fname">Full Name</label>
                        <input type="text" value={fullname} disabled />
                      </div>
                      <div className={styles.profileflexcase}>
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          name="email"
                          id="email"
                          disabled
                        />
                      </div>
                      <div className={styles.profileflexcase}>
                        <label htmlFor="number">Phone Number</label>
                        <input
                          type="number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          name="number"
                          id="number"
                          disabled={userData.phone ? true : false}
                        />
                      </div>
                      <div className={styles.profileflexcase}>
                        <label htmlFor="number">Address</label>
                        <input
                          type="number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          name="number"
                          id="number"
                          disabled={userData.phone ? true : false}
                        />
                      </div>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel>
            <AuthForm form="reset" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </DashboardLayout>
  );
}

export default Settings;
