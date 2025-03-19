import React, { useEffect, useState } from "react";
import styles from "./sms.module.css";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import SmsForm from "../../../components/forms/sms/SmsForm";
import { useNavigate } from "react-router-dom";
import ComposeSms from "../../../components/sms/ComposeSms";
import SentMessageTab from "../../../components/sms/SentMessageTab";
import GetScheduledMessages from "../../../components/sms/GetScheduledMessages";
import PersonalisedMessage from "../../../components/sms/PersonalisedMessage";
import SentoutTab from "../../../components/sms/SentoutTab";

function Sms() {
  const navigate = useNavigate();
  const [changeState, setChangeState] = useState(0);
  const dash_data = JSON.parse(localStorage.getItem("dash_data"));
  const [zero_contacts, setZero_contacts] = useState(false);
  const modalWidth = useBreakpointValue({ base: "90%", md: "50%" });
  const cancelRef = React.useRef();

  useEffect(() => {
    if (dash_data) {
      if (parseInt(dash_data.total_contacts.data.contact_count) <= 0) {
        setZero_contacts(true);
      }
    }
  }, []);

  return (
    <DashboardLayout pageName={"Bulk SMS"}>
      <div className={styles.sms_tab_main}>
        <AlertDialog
          isOpen={zero_contacts}
          leastDestructiveRef={cancelRef}
          onClose={() => setZero_contacts(false)}
          closeOnOverlayClick={false}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent width={modalWidth}>
              <Alert
                status="info"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="300px"
              >
                <CloseButton
                  alignSelf="flex-start"
                  position="relative"
                  right="-90%"
                  top={-5}
                  onClick={() => setZero_contacts(false)}
                />

                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  Your Contact List is Empty!
                </AlertTitle>
                <AlertDescription maxWidth="sm" m="10px 0px">
                  You need to upload your contacts through a csv or by typing to
                  be able to send an sms!
                </AlertDescription>
                <Button
                  onClick={() =>
                    navigate("/dashboard/contacts", { state: true })
                  }
                  mt="20px"
                  colorScheme="blue"
                >
                  Add Contacts
                </Button>
              </Alert>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <Tabs
          colorScheme="blue"
          style={{ marginTop: "30px" }}
          index={changeState}
          variant="unstyled"
          onChange={(index) => setChangeState(index)}
        >
          <TabList
            overflowX="auto" // Enable horizontal scrolling
            whiteSpace="nowrap"
            className={`${styles.list} hide-scroll`}
          >
            <Tab _selected={{ color: "#FF3C78", fontWeight: "bold" }}>
              Compose SMS
            </Tab>
            <Tab _selected={{ color: "#FF3C78", fontWeight: "bold" }}>
              Personalise message
            </Tab>
            <Tab _selected={{ color: "#FF3C78", fontWeight: "bold" }}>
              Scheduled SMS
            </Tab>
            <Tab _selected={{ color: "#FF3C78", fontWeight: "bold" }}>
              Sent Messages
            </Tab>
            <Tab _selected={{ color: "#FF3C78", fontWeight: "bold" }}>
              Message History
            </Tab>
            <Tab _selected={{ color: "#FF3C78", fontWeight: "bold" }}>
              Drafts
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ComposeSms />
            </TabPanel>
            <TabPanel>
              <PersonalisedMessage />
            </TabPanel>
            <TabPanel>
              <GetScheduledMessages />
            </TabPanel>
            <TabPanel>
              <SentoutTab />
            </TabPanel>
            <TabPanel>
              <SentMessageTab />
            </TabPanel>
            <TabPanel>
              {/* <SmsForm
                changeState={changeState}
                setChangeState={setChangeState}
              /> */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

export default Sms;
