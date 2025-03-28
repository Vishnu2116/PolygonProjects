import React, { useState } from 'react';
import { 
  FaPrint, 
  FaSearch, 
  FaHandPaper, 
  FaRulerVertical,
  FaDrawPolygon 
} from 'react-icons/fa';
import '../styles/ToolBar.css';

const toolbarItems = [
  { 
    icon: FaPrint, 
    tooltip: 'Print',
    action: () => console.log('Print action') 
  },
  { 
    icon: FaSearch, 
    tooltip: 'Search',
    action: () => console.log('Search action') 
  },
  { 
    icon: FaHandPaper, 
    tooltip: 'Pan',
    action: () => console.log('Pan action') 
  },
  { 
    icon: FaRulerVertical, 
    tooltip: 'Line Scale',
    action: () => console.log('Line Scale action') 
  },
  { 
    icon: FaDrawPolygon, 
    tooltip: 'Polygon Scale',
    action: () => console.log('Polygon Scale action') 
  }
];

const ToolBar = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (index) => {
    setActiveItem(index);
    toolbarItems[index].action();
  };

  return (
    <div className="toolbar">
      {toolbarItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div 
            key={index} 
            className={`toolbar-item ${activeItem === index ? 'active' : ''}`}
            onClick={() => handleItemClick(index)}
            title={item.tooltip}
          >
            <IconComponent className="toolbar-icon" />
          </div>
        );
      })}
    </div>
  );
};

export default ToolBar;