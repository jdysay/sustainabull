// Inventory.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// CHANGE TO FETCH FROM DB
const Inventory = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Carrot', description: 'Increases health by X', quantity: 3 },
    { id: 2, name: 'Corn Chunks', description: 'Increases health by X', quantity: 2 },
    { id: 3, name: 'Apple', description: 'Increases health by X', quantity: 1 },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showUseDialog, setShowUseDialog] = useState(false);
  const [targetCow, setTargetCow] = useState(null);

  // CHANGE TO FETCH FROM DB
  const cows = [
    { id: 1, name: 'Mr. Bobby the Bull', level: 5},
    { id: 2, name: 'Daisy the Cow', level: 3},
  ];

  const handleUseItem = (item) => {
    setSelectedItem(item);
    setShowUseDialog(true);
  };

  const confirmUseItem = (cow) => {
    setTargetCow(cow);
    // CHANGE TO FETCH FROM DB
    console.log(`Using ${selectedItem.name} on ${cow.name}`);
    
    // Decrease item quantity
    setInventory(prev => 
      prev.map(i => 
        i.id === selectedItem.id ? { ...i, quantity: i.quantity - 1 } : i
      ).filter(i => i.quantity > 0)
    );
    
    setShowUseDialog(false);
    setSelectedItem(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">INVENTORY</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {inventory.map(item => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-medium mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-3">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">Qty: {item.quantity}</span>
              <button 
                onClick={() => handleUseItem(item)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                disabled={item.quantity <= 0}
              >
                Use
              </button>
            </div>
          </div>
        ))}
      </div>

        <div className="flex justify-around mt-8 pt-4 border-t border-gray-200">
            <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
                Home
            </Link>
        </div>

      {/* Use Item Dialog */}
      {showUseDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">
              Use {selectedItem?.name} on which cow?
            </h3>
            
            <div className="space-y-3 mb-6">
              {cows.map(cow => (
                <div 
                  key={cow.id} 
                  className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => confirmUseItem(cow)}
                >
                  <h4 className="font-medium">{cow.name}</h4>
                  <p className="text-sm text-gray-600">Level {cow.level}</p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setShowUseDialog(false)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;