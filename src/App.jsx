import React, { useState } from "react";

const App = () => {
  const [consignmentNum, setConsignmentNum] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [isDelivered, setIsDelivered] = useState(false);
  const [status, setStatus] = useState("N/A");
  const [consNum, setConsNum] = useState("N/A");
  const [bookDate, setBookDate] = useState("N/A");
  const [from, setFrom] = useState("N/A");
  const [to, setTo] = useState("N/A");
  const [numOfPkg, setNumOfPkg] = useState("N/A");
  const [weight, setWeight] = useState("N/A");

  const handleChange = (e) => {
    setConsignmentNum(e.target.value);
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getStatus = async () => {
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
  };

  return (
    <div>
      <div className="back-img w-full h-screen grid place-items-center overflow-y-scroll poppins-medium">
        <div className="track-box w-2/3 bg-[#ffffff8a] backdrop-blur-md border border-white/20 shadow-lg p-6 relative">
          <div className="track-right flex flex-row gap-1">
            <input
              onChange={handleChange}
              value={consignmentNum}
              type="text"
              className="w-full text-center bg-white outline-none text-black h-14"
              placeholder="Enter Consignment Number"
            />
            <button
              onClick={() => {
                getStatus();
              }}
              className="bg-blue-800 text-white w-1/2 h-14 cursor-pointer hover:bg-blue-900 duration-300"
            >
              Track
            </button>
          </div>
          <div className={`shipmentDets flex-col w-full bg-white px-10 py-5 gap-5 absolute top-[150%] left-0 ${
            (!isVisible) ? "hidden" : "flex"
          }`}>
            <div className="col w-full flex flex-row justify-between">
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
              <h1 className>{consNum}</h1>
            </div>
            <div className="col w-full flex flex-row justify-between">
              <h1>Booking Date</h1>
              <h1 className>{bookDate}</h1>
            </div>
            <div className="col w-full flex flex-row justify-between">
              <h1>From</h1>
              <h1 className>{capitalize(from)}</h1>
            </div>
            <div className="col w-full flex flex-row justify-between">
              <h1>To</h1>
              <h1 className>{capitalize(to)}</h1>
            </div>
            <div className="col w-full flex flex-row justify-between">
              <h1>No. of Packages</h1>
              <h1 className>{numOfPkg} Units</h1>
            </div>
            <div className="col w-full flex flex-row justify-between">
              <h1>Weight</h1>
              <h1 className>{weight}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
