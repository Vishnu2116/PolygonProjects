import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import "../../styles/RecordDetails.css";
import RecordCategories from "./RecordCategories"; // Make sure path is correct

const RecordDetails = ({ data, onClose }) => {
  // ✅ Accept props
  const [showCategories, setShowCategories] = useState(false);

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };
  const LABEL_MAP = {
    V_Name: "Village",
    M_Name: "Mandal",
    D_Name: "District",
    DMV_Code: "DMV Code",
    Parcel_num: "Parcel Number",
    Shape_Leng: "Shape Length (km)",
    Shape_Area: "Shape Area (sq.km)",
    Project: "Project",
    AWC_Name: "Anganwadi Center",
    Name: "POI Name",
    Locality: "Locality",
    Status: "Heritage Status",
    LULC_1: "LULC Category",
  };

  //console.log(data);

  return (
    <>
      <div className="records-sidebar">
        <div className="records-header">
          <button className="back-button" onClick={onClose}>
            <ArrowLeft size={20} />
          </button>
          <h2 className="location-title">Tadepalli</h2>
        </div>

        <div className="section-header">
          <div className="section-title">
            <div className="icon-container">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path
                  d="M4 4H10V10H4V4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 4H20V10H14V4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 14H10V20H4V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14H20V20H14V20Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span>Records</span>
          </div>
          <div
            className="manage-button-container"
            style={{ position: "relative" }}
          >
            {/* <button className="manage-button" onClick={toggleCategories}>
              Manage
            </button> */}
            {/* Record Categories positioned relative to manage button */}
            {showCategories && (
              <div className="categories-container-wrapper">
                <RecordCategories />
              </div>
            )}
          </div>
        </div>

        <div className="records-content">
          <div className="records-list">
            {Object.entries(data).map(([key, value]) => {
              if (!LABEL_MAP[key] || value === null || value === "")
                return null;

              return (
                <div className="record-item" key={key}>
                  <div className="item-label">{LABEL_MAP[key]}</div>
                  <div className="item-value">
                    {typeof value === "number"
                      ? value.toFixed(6)
                      : value.toString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordDetails;
