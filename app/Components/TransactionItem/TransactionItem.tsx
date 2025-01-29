import React from 'react';
import './TransactionItem.css';
import { MdShoppingCart, MdFastfood, MdAttachMoney, MdMovie, MdLocalMall, MdReceipt } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";

interface TransactionItemProps {
  type: string;
  amount: number;
  category: string;
}

const categories: { [key: string]: { icon: React.ComponentType; color: string } } = {
  ["Online Shopping"]: {
    icon: MdShoppingCart,
    color: '#FFB3A7' 
  },
  ["Groceries"]: {
    icon: MdFastfood,
    color: '#A3E4D7' 
  },
  ["Entertainment"]: {
    icon: MdMovie,
    color: '#D7BDE2' 
  },
  ["Clothing"]: {
    icon: MdLocalMall,
    color: '#FADBD8' 
  },
  ["Bills"]: {
    icon: MdReceipt,
    color: '#AED6F1' 
  },
  ["Other"]: {
    icon: MdAttachMoney,
    color: '#F9E79F' 
  },
};

function TransactionItem({ type, amount, category }: TransactionItemProps) {
  const categoryDetails = type.includes('transfer') ? { icon: BiTransfer, color: '#68c9c4' } : categories[category] || categories['Other'];
  return (
    <div className='transaction'>

      {categoryDetails && React.createElement(categoryDetails.icon as React.ComponentType<{ style: React.CSSProperties, className?: string }>, { style: { backgroundColor: categoryDetails.color }, className: 'icon' })}
      <div>
        <div className='type'>{type}</div>
        <div className='category'>{category}</div>
      </div>
      <span className='amount' style={{ color: amount >= 0 ? '#68c9c4' : 'initial' }}>{amount} €</span>
    </div>
  );
}

export default TransactionItem;
