import { useState, useRef } from "react";
import React from 'react';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoiceForm = () => {
  const invoiceRef = useRef();

  const [invoiceData, setInvoiceData] = useState({
    businessName: "",
    clientName: "",
    clientEmail: "",
    invoiceDate: "",
    dueDate: "",
    items: [{ description: "", quantity: 1, price: 0 }],
    taxRate: 0,
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index][field] = value;
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, price: 0 }],
    });
  };

  const downloadPDF = () => {
    html2canvas(invoiceRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("invoice.pdf");
    });
  };

  const subtotal = invoiceData.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const tax = (subtotal * invoiceData.taxRate) / 100;
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg font-sans">
      <div ref={invoiceRef} className="p-6 bg-white text-gray-800">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold">Invoice</h1>
          <div className="text-right">
            <p className="text-sm font-medium">{invoiceData.businessName || "Your Company"}</p>
            <p className="text-xs text-gray-500">Date: {invoiceData.invoiceDate || "--"}</p>
            <p className="text-xs text-gray-500">Due: {invoiceData.dueDate || "--"}</p>
          </div>
        </div>
  
        {/* Client Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-1 mb-2">Bill To:</h2>
          <p className="text-sm">{invoiceData.clientName}</p>
          <p className="text-sm text-gray-600">{invoiceData.clientEmail}</p>
        </div>
  
        {/* Items Table */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-1 mb-2">Line Items</h2>
          <div className="space-y-3">
            {invoiceData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  className="col-span-2 border p-2 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", Number(e.target.value))
                  }
                  className="border p-2 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", Number(e.target.value))
                  }
                  className="border p-2 rounded text-sm"
                />
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>
  
        {/* Notes */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-1 mb-2">Notes</h2>
          <textarea
            name="notes"
            placeholder="Payment instructions or other details"
            value={invoiceData.notes}
            onChange={handleChange}
            className="w-full border p-2 rounded text-sm"
            rows="3"
          ></textarea>
        </div>
  
        {/* Totals */}
        <div className="border-t pt-4 text-right">
          <p className="text-sm">Subtotal: <span className="font-medium">${subtotal.toFixed(2)}</span></p>
          <p className="text-sm">Tax ({invoiceData.taxRate || 0}%): <span className="font-medium">${tax.toFixed(2)}</span></p>
          <p className="text-xl font-bold mt-2">Total: ${total.toFixed(2)}</p>
        </div>
      </div>
  
      <button
        onClick={downloadPDF}
        className="mt-6 w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Download PDF
      </button>
    </div>
  );  
};

export default InvoiceForm;
