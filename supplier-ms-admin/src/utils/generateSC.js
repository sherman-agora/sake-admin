import jsPDF from "jspdf";
import "jspdf-autotable";
import T2W from "numbers2words";
import capitalizeFirstLetter from "./capitalizeFirstLetter";
import dayjs from "dayjs";
import "./msjh-normal";

const SCGenerator = (dataArray) => () => {
  var now = dayjs();
  var translator = new T2W("EN_US");
  let data = [];
  let col = [
    { dataKey: "count", header: "Item" },
    { dataKey: "no", header: "Product No" },
    { dataKey: "des", header: "Description" },
    { dataKey: "qty", header: "Qty" },
    { dataKey: "price", header: "Price" },
    { dataKey: "amount", header: "Amount" },
  ];
  var productDiscountAmount = 0;
  var doc = new jsPDF("p", "pt");

  doc.page = 1;
  var totalPagesExp = "{total_pages_count_string}";
  var width = doc.internal.pageSize.getWidth();
  var height = doc.internal.pageSize.getHeight();
  var header = function () {
    var str = doc.internal.getNumberOfPages().toString();
    if (typeof doc.putTotalPages === "function") {
      str = str + " of " + totalPagesExp;
    }

    doc.setFontSize(23);
    doc.setFontStyle("bold");
    doc.text(width - 200, 50, "Sales Contract");

    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text(50, 120, "Bill To:");
    doc.setFontStyle("normal");
    doc.text(100, 120, dataArray.salesOrder.shop.nameEn);
    doc.setFont("msjh");
    doc.text(100, 135, dataArray.salesOrder.shop.deliverAddress);
    doc.text(100, 150, "");
    doc.text(100, 165, "");
    doc.setFont("helvetica");
    doc.setFontStyle("bold");
    doc.text(50, 185, "Attn:");
    doc.setFontStyle("normal");
    doc.text(100, 185, dataArray.salesOrder.shop.customer.nameEn);
    doc.setFontStyle("bold");
    doc.text(50, 200, "Tel:");
    doc.setFontStyle("normal");
    doc.text(
      100,
      200,
      dataArray.salesOrder.shop.phone
        ? dataArray.salesOrder.shop.phone.toString()
        : ""
    );
    doc.setFontStyle("bold");
    doc.text(200, 200, "Fax:");
    doc.setFontStyle("normal");
    doc.text(
      250,
      200,
      dataArray.salesOrder.shop.phone
        ? dataArray.salesOrder.shop.phone.toString()
        : ""
    );

    doc.setFontStyle("bold");
    doc.text(400, 120, "Date:");
    doc.setFontStyle("normal");
    doc.text(460, 120, now.format("DD/MMM/YYYY"));
    doc.setFontStyle("bold");
    doc.text(400, 135, "REF. No.:");
    doc.setFontStyle("normal");
    doc.text(460, 135, dataArray.salesOrder.code);
    doc.setFontStyle("bold");
    doc.text(400, 150, "Cust. ID:");
    doc.setFontStyle("normal");
    doc.text(460, 150, dataArray.salesOrder.shop.customer.code);
    doc.setFontStyle("bold");
    doc.text(400, 165, "Pay term:");
    doc.setFontStyle("normal");
    doc.text(460, 165, "");
    doc.setFontStyle("bold");
    doc.text(400, 180, "Ship Date:");
    doc.setFontStyle("normal");
    doc.text(
      460,
      180,
      dayjs(dataArray.salesOrder.shippingDate).format("DD/MMM/YYYY")
    );
    doc.setFontStyle("bold");
    doc.text(400, 195, "Salesman:");
    doc.setFontStyle("normal");
    doc.text(460, 195, "");
    doc.setFontStyle("bold");
    doc.text(400, 210, "Page:");
    doc.setFontStyle("normal");
    doc.text(460, 210, str);

    doc.setLineWidth(1.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(50, 220, width - 50, 220);
    doc.line(50, 240, width - 50, 240);
  };

  var footer = function () {
    doc.setFontSize(7);
    doc.text(width - 40, height - 30, "Page - " + doc.page);
    doc.page++;
  };

  var options = {
    beforePageContent: header,
    afterPageContent: footer,
    theme: "plain",

    columnStyles: {
      count: { columnWidth: 30 },
      no: { columnWidth: 65 },
      des: { columnWidth: 280 },
      qty: { columnWidth: 25 },
      price: { columnWidth: 40 },
      amount: { columnWidth: 50, halign: "right" },
    },
    styles: { font: "msjh", fontStyle: "normal" },
    headStyles: {
      fillColor: false,
      textColor: "black",
      fontStyle: "bold",
      font: "helvetica",
    },
    style: { cellWidth: "auto" },
    margin: { top: 220, bottom: 210, horizontal: 50 },
  };

  dataArray.salesOrder.products.map((item, index) => {
    let b = {
      count: index + 1,
      no: item.product.code,
      des: `${item.product.nameEn}\n${item.product.nameChi}`,
      qty: item.quantity,
      price: item.wholeSalePrice.toFixed(1),
      amount: (item.wholeSalePrice * item.quantity).toFixed(1),
    };
    console.log(item.wholeSalePrice);
    productDiscountAmount += item.discountAmount;
    data.push(b);
  });

  doc.autoTable(col, data, options);
  doc.setFontSize(10);
  doc.setFontStyle("normal");
  doc.text(412, doc.autoTable.previous.finalY + 12, "Sub-total :");
  doc.text(
    width - 53 - 5 * dataArray.salesOrder.subtotal.toFixed(1).toString().length,
    doc.autoTable.previous.finalY + 12,
    dataArray.salesOrder.subtotal.toFixed(1).toString()
  );
  doc.text(
    340,
    doc.autoTable.previous.finalY + 30,
    "Product Discount Amount :"
  );
  doc.text(
    width - 47 - 5 * (productDiscountAmount.toFixed(1).toString().length + 1),
    doc.autoTable.previous.finalY + 30,
    productDiscountAmount.toFixed(1).toString()
  );
  doc.text(376, doc.autoTable.previous.finalY + 50, "Discount Coupon :");
  doc.text(
    width -
      47 -
      5 *
        (dataArray.salesOrder.couponDiscount.toFixed(1).toString().length + 1),
    doc.autoTable.previous.finalY + 50,
    dataArray.salesOrder.couponDiscount.toFixed(1).toString()
  );

  doc.text(395, doc.autoTable.previous.finalY + 70, "Special Offer :");
  doc.text(
    width -
      47 -
      5 * (dataArray.salesOrder.discount.toFixed(1).toString().length + 1),
    doc.autoTable.previous.finalY + 70,
    dataArray.salesOrder.discount.toFixed(1).toString()
  );
  doc.text(400, doc.autoTable.previous.finalY + 90, "Grand Total :");
  doc.text(
    width -
      53 -
      5 * dataArray.salesOrder.grandTotal.toFixed(1).toString().length,
    doc.autoTable.previous.finalY + 90,
    dataArray.salesOrder.grandTotal.toFixed(1).toString()
  );
  if (
    dataArray.salesOrder.grandTotal ===
    parseInt(dataArray.salesOrder.grandTotal, 10)
  ) {
    doc.text(
      50,
      doc.autoTable.previous.finalY + 110,
      "Say: Hong Kong Dollar " +
        capitalizeFirstLetter(
          translator.toWords(dataArray.salesOrder.grandTotal)
        ) +
        " ONLY."
    );
  } else {
    const strings = dataArray.salesOrder.grandTotal
      .toFixed(1)
      .toString()
      .split(".");
    doc.text(
      50,
      doc.autoTable.previous.finalY + 110,
      "Say: Hong Kong Dollar " +
        capitalizeFirstLetter(translator.toWords(parseInt(strings[0]))) +
        " And " +
        capitalizeFirstLetter(translator.toWords(parseInt(strings[1] * 10))) +
        " CENTS ONLY."
    );
  }
  doc.setFontStyle("bold");
  doc.text(50, doc.autoTable.previous.finalY + 127, "Shipterm :");
  doc.setFontStyle("normal");
  doc.text(100, doc.autoTable.previous.finalY + 127, "Standard Delivery");
  doc.setFontStyle("bold");
  doc.text(50, doc.autoTable.previous.finalY + 145, "REMARKS :");
  doc.setFontStyle("normal");
  doc.setFont("msjh");
  doc.text(
    115,
    doc.autoTable.previous.finalY + 145,
    dataArray.salesOrder.remark ? dataArray.salesOrder.remark : ""
  );
  doc.setFont("helvetica");
  doc.setFontSize(8);
  doc.text(
    350,
    doc.autoTable.previous.finalY + 160,
    "RECEIVED THE ABOVE IN GOOD CONDITIONS :"
  );
  doc.line(
    350,
    doc.autoTable.previous.finalY + 230,
    width - 50,
    doc.autoTable.previous.finalY + 230
  );
  doc.text(
    350,
    doc.autoTable.previous.finalY + 240,
    "COMPANY CHOP & AUTHORIZED SIGNATURE :"
  );
  doc.setLineWidth(1);
  doc.setDrawColor(0, 0, 0);
  doc.line(
    455,
    doc.autoTable.previous.finalY,
    width - 50,
    doc.autoTable.previous.finalY
  );
  doc.line(
    455,
    doc.autoTable.previous.finalY + 73,
    width - 50,
    doc.autoTable.previous.finalY + 73
  );
  doc.line(
    455,
    doc.autoTable.previous.finalY + 93,
    width - 50,
    doc.autoTable.previous.finalY + 93
  );
  doc.line(
    455,
    doc.autoTable.previous.finalY + 95,
    width - 50,
    doc.autoTable.previous.finalY + 95
  );
  doc.setLineWidth(1.5);
  doc.setDrawColor(0, 0, 0);
  doc.line(
    50,
    doc.autoTable.previous.finalY + 116,
    width - 50,
    doc.autoTable.previous.finalY + 116
  );
  doc.line(
    50,
    doc.autoTable.previous.finalY + 131,
    width - 50,
    doc.autoTable.previous.finalY + 131
  );

  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages(totalPagesExp);
  }
  doc.save(`SO-${dataArray.salesOrder.code}.pdf`);
};
export default SCGenerator;
