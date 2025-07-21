import React from 'react';
import ProductImage from './ProductImage';
import './VendingMachineItemCard.css';

const VendingMachineItemCard = ({ product, machine }) => {
  return (
    <div className="vm-item-card">
      <ProductImage productName={product} size="medium" className="vm-item-image" />
      <div className="vm-item-info">
        <div className="vm-item-name">{product}</div>
        <div className="vm-item-location">
          <span className="vm-item-building">{machine.building}</span>
          {machine.floor && <span className="vm-item-floor">, {machine.floor}</span>}
        </div>
        {machine.notes && <div className="vm-item-notes">{machine.notes}</div>}
      </div>
    </div>
  );
};

export default VendingMachineItemCard; 