import React, { useState } from 'react';
import '../../styles/RecordDetails.css';

const RecordCategories = () => {
    const [expandedItem, setExpandedItem] = useState(null);

    const recordTypes = [
        { id: 'ownership', name: 'Ownership Records', color: '#2ecc71' },
        { id: 'revenue', name: 'Revenue Records', color: '#9b59b6' },
        { id: 'municipal', name: 'Municipal Records', color: '#3498db' },
        { id: 'rera', name: 'RERA Records', color: '#34495e' },
        { id: 'litigation', name: 'Litigation Records', color: '#3498db' },
        { id: 'cersai', name: 'Cersai Records', color: '#e74c3c' }
    ];

    const toggleExpand = (id) => {
        if (expandedItem === id) {
            setExpandedItem(null);
        } else {
            setExpandedItem(id);
        }
    };

    return (
        <div className="categories-container">
            {recordTypes.map((record) => (
                <div key={record.id} className="record-category-wrapper">
                    <div
                        className="record-header"
                        onClick={() => toggleExpand(record.id)}
                        style={{ color: record.color }}
                    >
                        <div className="record-icon-title">
                            <span className="record-icon">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke={record.color} strokeWidth="2" fill="none" />
                                </svg>
                            </span>
                            <span className="record-title">{record.name}</span>
                        </div>
                        <span className="expand-icon">
                            {expandedItem === record.id ? '∨' : '∧'}
                        </span>
                    </div>

                    {expandedItem === record.id && record.id === 'ownership' && (
                        <div className="record-details">
                            <div className="record-field">
                                <span className="field-label">First Part Names</span>
                                <span className="field-value">Narasamiha Dadrubu</span>
                            </div>
                            <div className="record-field">
                                <span className="field-label">Second Part Names</span>
                                <span className="field-value">Iingesh Dadrubu</span>
                            </div>
                            <div className="record-field">
                                <span className="field-label">Transaction Type</span>
                                <span className="field-value">Bank Withdraw/ loan</span>
                            </div>
                            <div className="record-field">
                                <span className="field-label">Registration Date</span>
                                <span className="field-value">6/15/2019 12:00:00 AM</span>
                            </div>
                            <div className="record-field">
                                <span className="field-label">Registered at SRO</span>
                                <span className="field-value">6/15/2019 12:00:00 AM</span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default RecordCategories;