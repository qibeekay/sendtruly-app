import React, { useContext, useState } from "react";
import styles from "./contact.module.css";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Button,
  useToast,
} from "@chakra-ui/react";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";

import ContactForm from "../../../components/forms/contact/ContactForm";
import { useLocation } from "react-router-dom";
import CreateGroup from "../../../components/contacts/CreateGroup";
import { CreateList } from "../../../api/contact";
import { HiX } from "react-icons/hi";
import {
  RefreshContext,
  RefreshProvider,
} from "../../../utility/RefreshContext";
import AllContactsTable from "../../../components/contacts/AllContactsTable";

function Contact() {
  const [groupModal, setGroupModal] = useState(false);
  // refresh state

  // const csvFile = "../../../assets/csv_samples/contacts_sample.csv";
  const csvUrl = "/contacts_sample.csv";

  const currentState = useLocation().state;
  const [changeState, setChangeState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { triggerRefresh, refreshCounter } = useContext(RefreshContext);

  const [formdata, setFormData] = useState({
    list_name: "",
  });

  const toast = useToast();

  // fucntion to handle form change event
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // function to open and close modal
  const setmodal = () => {
    setGroupModal(!groupModal);
  };

  // function to call the create group api
  const createGroup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await CreateList(formdata);

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    if (result.success) {
      setmodal();
      setFormData({ list_name: "" });
      // Trigger refresh
      triggerRefresh();
    }

    setIsLoading(false);
  };

  return (
    <DashboardLayout pageName={"Contact"}>
      <div className={`${styles.contact_tab_main}`}>
        <Tabs
          variant="soft-rounded"
          colorScheme="blue"
          defaultIndex={currentState ? 1 : 0}
          style={{ marginTop: "30px" }}
        >
          <TabList
            overflowX="auto" // Enable horizontal scrolling
            whiteSpace="nowrap"
          >
            {/* <Tab onClick={() => setChangeState(changeState + 1)}>
              Manage lists
            </Tab> */}
            <Tab>Contact Groups</Tab>
            <Tab>Contacts</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className={styles.tab_format_container}>
                {/* <ContactForm form="create" /> */}
                <CreateGroup setmodal={setmodal} />
              </div>
            </TabPanel>
            <TabPanel>
              <AllContactsTable />
              {/* <div className={styles.tab_format_container}>
                <Text mt={4} as="h6" size="sm">
                  Upload format (select a csv file, each line should contain
                  phone number)
                </Text>
                <a
                  href={"https://app.sendtruly.com/contacts_sample.csv"}
                  download="contacts_sample.csv"
                >
                  <Button
                    width={"100%"}
                    size="md"
                    colorScheme="blue"
                    border="1px"
                    mt="24px"
                    variant="outline"
                    // onClick={handleDownload}
                  >
                    Download csv format
                  </Button>
                </a>
                <ContactForm />
              </div> */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      {/* create group modal */}
      {/* Modal displays form to create a group */}
      <div
        className={`fixed left-0 top-0 w-full bg-black/50 min-h-screen z-[100] items-center justify-center ${
          groupModal ? "flex" : "hidden"
        }`}
      >
        <div className="bg-white h-[35rem] overflow-y-scroll font-poppins p-7 rounded-[10px] w-[30rem] hide-scroll">
          <div>
            {/* close button */}
            <button className="w-full flex justify-end mb-4" onClick={setmodal}>
              <HiX size={25} />
            </button>

            <h1 className="text-[24px]">Create Contact Group</h1>

            <form action="" onSubmit={createGroup}>
              <div className="flex flex-col gap-2 my-5">
                <label htmlFor="List">Name of Group</label>
                <input
                  type="text"
                  name="list_name"
                  value={formdata.list_name}
                  onChange={handleChange}
                  className="p-3 border shadow-md outline-pinks"
                  required
                />
              </div>

              {/* button */}
              <button className="py-4 text-white font-semibold w-full bg-pinks rounded-[10px] hover:bg-pinks/80 duration-300 ease-in-out">
                {isLoading ? "Loading..." : "Create Group"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Contact;
