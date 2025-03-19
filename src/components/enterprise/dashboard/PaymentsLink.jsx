import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { CreateInvoice, VerifyKey } from "../../../api/text2pay";
import { GetUserInfo } from "../../../api/profile";
import { HiOutlineChevronDown, HiX } from "react-icons/hi";

const PaymentsLink = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [showInvoices, setShowInvoices] = useState(false); // State to toggle invoice dropdown
  const userData = JSON.parse(localStorage.getItem("data_user_main"));

  const toast = useToast();

  // Fetch user data
  const fetchUserData = async () => {
    setIsLoading(true);
    const result = await GetUserInfo(userData?.user?.usertoken);
    setConnected(result?.data?.data?.connected);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    invoices: [], // Start with an empty list of invoices
    total_price: 0,
    expiry_date: "",
    desc: "",
  });

  const [currentInvoice, setCurrentInvoice] = useState({
    amount: 0,
    goods: "",
    quantity: 1,
  });

  // Handle input changes for the main form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for the current invoice item
  const handleCurrentInvoiceChange = (e) => {
    const { name, value } = e.target;
    setCurrentInvoice((prev) => ({ ...prev, [name]: value }));
  };

  // Add the current invoice item to the list
  const addInvoiceItem = (e) => {
    e.preventDefault();

    // Validate the current invoice item
    if (
      !currentInvoice.goods ||
      !currentInvoice.amount ||
      !currentInvoice.quantity
    ) {
      toast({
        title: "Error",
        description: "Please fill out all fields for the invoice item.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Add the current invoice to the list
    const updatedInvoices = [...formData.invoices, currentInvoice];

    // Recalculate total price
    const totalPrice = updatedInvoices.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    // Update form data
    setFormData((prev) => ({
      ...prev,
      invoices: updatedInvoices,
      total_price: totalPrice,
    }));

    // Reset the current invoice input
    setCurrentInvoice({ amount: 0, goods: "", quantity: 1 });

    toast({
      title: "Success!",
      description: "Invoice item added.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Remove an invoice item
  const removeInvoiceItem = (index) => {
    const updatedInvoices = formData.invoices.filter((_, i) => i !== index);

    // Recalculate total price
    const totalPrice = updatedInvoices.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    // Update form data
    setFormData((prev) => ({
      ...prev,
      invoices: updatedInvoices,
      total_price: totalPrice,
    }));

    toast({
      title: "Removed!",
      description: "Invoice item removed.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Function to connect Paystack key
  const connectPaystack = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await VerifyKey({ secretKey: secretKey });

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    if (result.success) {
      await fetchUserData();
    }

    setIsLoading(false);
    setIsModalOpen(false);
  };

  // Function to call and create payment link
  const createPaymentLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await CreateInvoice(formData);

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    //console.log(result);

    setIsLoading(false);
  };

  //console.log(formData);
  return (
    <div className="w-full min-h-[238px] shadow-md rounded-[20px] px-4 py-7 bg-[#FF1D9C57]">
      {/* text */}
      <div className="">
        <h1>Ask For Online Reviews</h1>
        <p>Where do you want to increase your online reputation?</p>
      </div>

      {!connected ? (
        <>
          {/* connect secret key */}
          <div className="mt-7">
            <div className="">
              {/* text */}
              <div>
                <p>Connect your Paystack account to start accepting payments</p>
              </div>
            </div>

            {/* button to open modal */}
            <button
              className="py-4 text-white font-semibold w-full bg-pinks rounded-[10px] hover:bg-pinks/80 duration-300 ease-in-out flex items-center justify-center"
              onClick={() => setIsModalOpen(true)}
            >
              Connect Paystack
            </button>
          </div>
        </>
      ) : (
        <>
          {/* form */}
          <form onSubmit={createPaymentLink} className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block mb-2 font-medium">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter invoice title"
                required
              />
            </div>

            {/* Current Invoice Input */}
            <div>
              <label className="block mb-2 font-medium">Add Invoice Item</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Amount */}
                <div>
                  <label htmlFor="amount" className="block mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={currentInvoice.amount}
                    onChange={handleCurrentInvoiceChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                {/* Goods */}
                <div>
                  <label htmlFor="goods" className="block mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    id="goods"
                    name="goods"
                    value={currentInvoice.goods}
                    onChange={handleCurrentInvoiceChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter description"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={currentInvoice.quantity}
                    onChange={handleCurrentInvoiceChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter quantity"
                    required
                  />
                </div>
              </div>

              {/* Add Invoice Item Button */}
              <button
                type="button"
                onClick={addInvoiceItem}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Add Item
              </button>
            </div>

            {/* Invoice List Dropdown */}
            {formData.invoices.length > 0 && (
              <div className="my-4">
                {/* Toggle button */}
                <button
                  type="button"
                  onClick={() => setShowInvoices(!showInvoices)}
                  className="flex items-center gap-2 text-pinks font-medium hover:text-pinks/80 transition-colors duration-200"
                >
                  <span>View Added Invoices ({formData.invoices.length})</span>
                  <HiOutlineChevronDown />
                </button>

                {/* Dropdown content */}
                {showInvoices && (
                  <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                    {formData.invoices.map((invoice, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{invoice.goods}</p>
                          <p className="text-sm text-gray-500">
                            Amount: NGN{invoice.amount}, Quantity:{" "}
                            {invoice.quantity}
                          </p>
                        </div>
                        <HiX
                          size={18}
                          className="ml-2 cursor-pointer text-red-500 hover:text-red-700"
                          onClick={() => removeInvoiceItem(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Total Price */}
            <div>
              <label htmlFor="total_price" className="block mb-2 font-medium">
                Total Price
              </label>
              <input
                type="number"
                id="total_price"
                name="total_price"
                value={formData.total_price}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter total price"
                readOnly
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label htmlFor="expiry_date" className="block mb-2 font-medium">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiry_date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="desc" className="block mb-2 font-medium">
                Description
              </label>
              <textarea
                id="desc"
                name="desc"
                value={formData.desc}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter a description"
                rows="4"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Payment Link"}
            </button>
          </form>
        </>
      )}

      {/* Connect secret key modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Connect Paystack</h2>
            <input
              type="text"
              placeholder="Enter your Paystack Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                onClick={connectPaystack}
              >
                {isLoading ? "Loading..." : "Connect"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsLink;
