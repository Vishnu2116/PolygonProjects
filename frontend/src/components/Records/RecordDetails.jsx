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
            <button className="manage-button" onClick={toggleCategories}>
              Manage
            </button>
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
            <div className="record-item">
              <div className="item-label">Object ID</div>
              <div className="item-value">55</div>
            </div>

            <div className="record-item">
              <div className="item-label">Name</div>
              <div className="item-value">Bloomfield Heights No 6</div>
            </div>

            <div className="record-item">
              <div className="item-label">Record Type</div>
              <div className="item-value">New Subdivision</div>
            </div>

            <div className="record-item">
              <div className="item-label">Recorded Date</div>
              <div className="item-value">7/15/2019 12:00:00 AM</div>
            </div>

            <div className="record-item">
              <div className="item-label">COGO Accuracy</div>
              <div className="item-value">GHMC</div>
            </div>

            <div className="record-item">
              <div className="item-label">Parcel Count</div>
              <div className="item-value">20</div>
            </div>

            <div className="record-item">
              <div className="item-label">Shape Length</div>
              <div className="item-value">4360244005</div>
            </div>

            <div className="record-item">
              <div className="item-label">Shape Area</div>
              <div className="item-value">813632677215</div>
            </div>

            <div className="record-item">
              <div className="item-label">Zone</div>
              <div className="item-value">Shamshabad</div>
            </div>

            <div className="record-item">
              <div className="item-label">GlobalID</div>
              <div className="item-value">
                S{"{490097-788-419-8248-070-96370259}"}
              </div>
            </div>

            <div className="record-item">
              <div className="item-label">Description</div>
              <div className="item-value">NUL</div>
            </div>

            <div className="record-item">
              <div className="item-label">Surveyor</div>
              <div className="item-value">Maheshwari</div>
            </div>

            <div className="record-item">
              <div className="item-label">Company</div>
              <div className="item-value">Cordova Brothers Inc.</div>
            </div>

            <div className="record-item">
              <div className="item-label">Surveyor date</div>
              <div className="item-value">6/15/2019 12:00:00 AM</div>
            </div>

            <div className="record-item">
              <div className="item-label">Document Index Number-</div>
              <div className="item-value">rp-2019-51480</div>
            </div>

            <div className="record-item">
              <div className="item-label">Shape Length</div>
              <div className="item-value">15436024440005</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordDetails;
