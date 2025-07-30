import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { ToastContainer, toast, Bounce } from "react-toastify";

const App = () => {
  const [consignmentNum, setConsignmentNum] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [isDelivered, setIsDelivered] = useState(false);
  const [consNum, setConsNum] = useState("N/A");
  const [bookDate, setBookDate] = useState("N/A");
  const [from, setFrom] = useState("N/A");
  const [to, setTo] = useState("N/A");
  const [numOfPkg, setNumOfPkg] = useState("N/A");
  const [weight, setWeight] = useState("N/A");
  const [close, setClose] = useState(false);

  const notify = () => toast.error("Something Went Wrong");
  const notifyEnterSomeValue = () =>
    toast.error("Tracking no. must have atleast 1 character");

  const handleChange = (e) => {
    setConsignmentNum(e.target.value.toUpperCase());
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getStatus = async () => {
    try {
      if (consignmentNum.length == 0) {
        notifyEnterSomeValue();
        return;
      }

      const res = await fetch(
        "https://lozicsnxtapp.lozics.in/api/Consignmenttracking/GetConsignmentTracking",
        {
          method: "POST",
          headers: {
            Authorization: "145-6298-404",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(consignmentNum),
        }
      );

      let data = await res.json();
      console.log(data);
      data = JSON.parse(data);

      const details = data.cnmtDetail[0];
      const movementDets = data.movementDetail[0];
      const deliveryStat = details.STATUS;

      if (deliveryStat.substr(0, 9) === "DELIVERED") {
        setIsDelivered(true);
      } else {
        setIsDelivered(false);
      }

      setIsVisible(true);
      setConsNum(details.CNNO);
      setBookDate(details.INVOICEDATE);
      setFrom(details.FROMSTATION);
      setTo(details.TOSTATION);
      setNumOfPkg(details.PKGS);
      setWeight(details.WEIGHT + " kg");
      setClose(false);
      setConsignmentNum("");
    } catch (err) {
      notify();
    }
  };

  return (
    <div>
      <div className="back-img md:p-0 p-10 w-full h-screen grid place-items-center poppins-medium overflow-hidden relative">
        <div className="track-box w-full md:w-1/3 bg-[#fff] backdrop-blur-md border-white/20 shadow-lg">
          <div className="consTitle p-6 w-full bg-blue-600 grid place-items-center ">
            <h1 className="text-white text-2xl">Consignment Tracker</h1>
          </div>
          <div className="track-right flex flex-col p-7">
            <h1>Enter Tracking Number</h1>
            <div className="flex flex-row mt-3">
              <input
                onChange={handleChange}
                value={consignmentNum}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    getStatus();
                  }
                }}
                type="text"
                className="w-full px-3 bg-white outline-none border-1 border-[#c9c9c9] text-black h-14 "
                placeholder="e.g. ABCXXXX"
              />
              <button
                onClick={() => {
                  getStatus();
                }}
                className="bg-blue-600 text-white w-1/2 h-14 cursor-pointer hover:bg-blue-800 duration-400"
              >
                Track
              </button>
            </div>
          </div>
        </div>
        <div
          className={`shipmentDets flex-col w-full md:w-1/3 bg-white ${
            close ? "hidden" : ""
          } px-10 py-6 gap-5 absolute ${
            !isVisible ? "hidden" : "flex"
          }`}
        >
          <div className="consHeading flex flex-row justify-between items-center relative">
            <h1 className="text-xl text-blue-600 border-b-1 w-fit border-gray-300 pb-2">
              Shipment Details
            </h1>
            <button
              onClick={() => {
                setClose(true);
              }}
              className="cursor-pointer"
            >
              <IoMdCloseCircle className="absolute top-0 right-0 text-2xl text-red-600" />
            </button>
          </div>
          <div className="col w-full flex flex-row justify-between mt-4">
            <h1>Consignment Status</h1>
            <h1
              className={`
                ${isDelivered ? "text-green-500" : "text-red-600"}
                `}
            >
              {isDelivered ? "Delivered" : "Not Delivered"}
            </h1>
          </div>
          <div className="col w-full flex flex-row justify-between">
            <h1>Consignment No.</h1>
            <h1>{consNum}</h1>
          </div>
          <div className="col w-full flex flex-row justify-between">
            <h1>Booking Date</h1>
            <h1>{bookDate}</h1>
          </div>
          <div className="col w-full flex flex-row justify-between">
            <h1>From</h1>
            <h1>{capitalize(from)}</h1>
          </div>
          <div className="col w-full flex flex-row justify-between">
            <h1>To</h1>
            <h1>{capitalize(to)}</h1>
          </div>
          <div className="col w-full flex flex-row justify-between">
            <h1>No. of Packages</h1>
            <h1>{numOfPkg} Units</h1>
          </div>
          <div className="col w-full flex flex-row justify-between">
            <h1>Weight</h1>
            <h1>{weight}</h1>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default App;
