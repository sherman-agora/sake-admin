import jsPDF from "jspdf";
import "jspdf-autotable";
import T2W from "numbers2words";
import capitalizeFirstLetter from "./capitalizeFirstLetter";
import dayjs from "dayjs";
import "./msjh-normal";

const INVGenerator = (dataArray) => () => {
  const invoice = dataArray.invoice;
  console.log("invoice", invoice);
  var now = dayjs();
  var translator = new T2W("EN_US");
  let data = [];
  let col = [
    { dataKey: "count", header: "Item" },
    { dataKey: "no", header: "Product No" },
    { dataKey: "des", header: "Description" },
    { dataKey: "qty", header: "Qty" },
    { dataKey: "price", header: "Price" },
    { dataKey: "discount", header: "Dis%" },
    { dataKey: "amount", header: "Amount" },
  ];
  // var productDiscountAmount = 0;
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
    doc.text(width - 150, 50, "INVOICE");

    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text(50, 120, "Bill To:");
    doc.setFontStyle("normal");
    doc.setFont("msjh");
    doc.text(100, 120, invoice.salesOrder.shop.nameEn || "");
    doc.setFont("msjh");
    doc.text(100, 135, invoice.salesOrder.shop.deliverAddress);
    doc.text(100, 130, "");
    doc.text(100, 145, "");
    doc.setFont("helvetica");
    doc.setFontStyle("bold");
    doc.text(50, 185, "Attn:");
    doc.setFontStyle("normal");
    doc.setFont("msjh");
    doc.text(100, 185, invoice.salesOrder.shop.customer.nameEn);
    doc.setFontStyle("bold");
    doc.text(50, 200, "Tel:");
    doc.setFontStyle("normal");
    doc.text(
      100,
      200,
      invoice.salesOrder.shop.phone
        ? invoice.salesOrder.shop.phone.toString()
        : ""
    );
    doc.setFontStyle("bold");
    doc.text(200, 200, "Fax:");
    doc.setFontStyle("normal");
    doc.text(
      250,
      200,
      invoice.salesOrder.shop.phone
        ? invoice.salesOrder.shop.phone.toString()
        : ""
    );

    doc.setFontStyle("bold");
    doc.text(400, 120, "Date:");
    doc.setFontStyle("normal");
    doc.text(460, 120, now.format("DD/MMM/YYYY"));

    doc.setFontStyle("bold");
    doc.text(400, 135, "REF. No.:");
    doc.setFontStyle("normal");
    doc.text(460, 135, invoice.code);
    doc.setFontStyle("bold");
    doc.text(400, 150, "Cust. ID:");
    doc.setFontStyle("normal");
    doc.text(460, 150, invoice.salesOrder.shop.customer.code);
    doc.setFontStyle("bold");
    doc.text(400, 165, "Pay term:");
    doc.setFontStyle("normal");
    doc.text(460, 165, "");
    doc.setFontStyle("bold");
    doc.text(400, 180, "Ship Date:");
    doc.setFontStyle("normal");
    doc.text(460, 180, dayjs(invoice.shipmentDate).format("DD/MMM/YYYY"));
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
      des: { columnWidth: 245 },
      qty: { columnWidth: 25 },
      price: { columnWidth: 40 },
      discount: { columnWidth: 35 },
      amount: { columnWidth: 50, halign: "right" },
    },
    styles: { font: "msjh", fontStyle: "normal" },
    headStyles: {
      fillColor: false,
      textColor: "black",
      fontStyle: "bold",
      font: "helvetica",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    style: { cellWidth: "auto" },
    margin: { top: 220, bottom: 300, horizontal: 50 },
  };

  invoice.salesOrder.products.map((item, index) => {
    const discount = item.discount.search('%') === -1 ? `$${item.discount.substring(3)}` : item.discount
    let b = {
      count: index + 1,
      no: item.product.code,
      des: `${item.product.nameEn}\n${item.product.nameChi}`,
      qty: item.quantity,
      discount: discount,
      price: item.wholeSalePrice.toFixed(1),
      amount: (item.price * item.quantity).toFixed(1),
    };
    // productDiscountAmount += item.discountAmount;
    if (!!item.product.printInInvoice) {
      data.push(b);
    }
  });

  doc.autoTable(col, data, options);
  doc.setFontSize(10);
  doc.setFontStyle("normal");
  doc.text(412, doc.autoTable.previous.finalY + 12, "Sub-total :");
  doc.text(
    width - 53 - 5 * invoice.salesOrder.subtotal.toFixed(1).toString().length,
    doc.autoTable.previous.finalY + 12,
    invoice.salesOrder.subtotal.toFixed(1).toString()
  );
  // doc.text(340, doc.autoTable.previous.finalY + 30, "Product Discount Amount :");
  // doc.text(
  //   width - 47 - 5 * (productDiscountAmount.toFixed(1).toString().length + 1),
  //   doc.autoTable.previous.finalY + 30,
  //   productDiscountAmount.toFixed(1).toString()
  // );
  doc.text(376, doc.autoTable.previous.finalY + 30, "Discount Coupon :");
  doc.text(
    width -
    47 -
    5 * (invoice.salesOrder.couponDiscount.toFixed(1).toString().length + 1),
    doc.autoTable.previous.finalY + 30,
    invoice.salesOrder.couponDiscount.toFixed(1).toString()
  );

  doc.text(395, doc.autoTable.previous.finalY + 50, "Special Offer :");
  doc.text(
    width -
    47 -
    5 * (invoice.salesOrder.discount.toFixed(1).toString().length + 1),
    doc.autoTable.previous.finalY + 50,
    invoice.salesOrder.discount.toFixed(1).toString()
  );
  doc.text(395, doc.autoTable.previous.finalY + 70, "Product Discount Total :");
  doc.text(
    width - 53 - 5 * (invoice.salesOrder.discountAmount - invoice.salesOrder.couponDiscount - invoice.salesOrder.discount).toFixed(1).toString().length,
    doc.autoTable.previous.finalY + 70,
    (invoice.salesOrder.discountAmount - invoice.salesOrder.couponDiscount - invoice.salesOrder.discount).toFixed(1).toString()
  );
  doc.text(405, doc.autoTable.previous.finalY + 90, "Grand Total :");
  doc.text(
    width - 53 - 5 * invoice.salesOrder.grandTotal.toFixed(1).toString().length,
    doc.autoTable.previous.finalY + 90,
    invoice.salesOrder.grandTotal.toFixed(1).toString()
  );

  if (
    invoice.salesOrder.grandTotal ===
    parseInt(invoice.salesOrder.grandTotal, 10)
  ) {
    doc.text(
      50,
      doc.autoTable.previous.finalY + 110,
      "Say: Hong Kong Dollar " +
      capitalizeFirstLetter(
        translator.toWords(invoice.salesOrder.grandTotal)
      ) +
      " ONLY."
    );
  } else {
    const strings = invoice.salesOrder.grandTotal
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
    doc.autoTable.previous.finalY + 54,
    width - 50,
    doc.autoTable.previous.finalY + 54
  );
  doc.line(
    455,
    doc.autoTable.previous.finalY + 73,
    width - 50,
    doc.autoTable.previous.finalY + 73
  );
  doc.line(
    455,
    doc.autoTable.previous.finalY + 75,
    width - 50,
    doc.autoTable.previous.finalY + 75
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
  let finalY = doc.autoTable.previous.finalY + 150;
  if (finalY + 210 >= height) {
    doc.addPage();
    finalY = 120;
  }
  const lineHeight = 10;
  const padding = 5;
  doc.setFillColor(255, 255, 255);
  doc.rect(90, finalY - padding * 2, 430, 210, "FD");
  doc.setFontStyle("bold");
  doc.setFontSize("8");
  doc.text(280, finalY, "REMARK");
  doc.setLineWidth(1);
  doc.line(100, finalY + padding, 510, finalY + padding);
  doc.line(100, finalY + 190, 510, finalY + 190);
  doc.text(
    100,
    finalY + padding + 1 * lineHeight + 0 * padding,
    "Payment Method: Cheque, Bank-In, FPS or Cash"
  );
  doc.text(
    100,
    finalY + padding + 2 * lineHeight + 1 * padding,
    "  1. Account Name: Petgo Trading Limited"
  );
  doc.text(
    100,
    finalY + padding + 3 * lineHeight + 1 * padding,
    "      Account No.: 741-149611-838"
  );
  doc.text(
    100,
    finalY + padding + 4 * lineHeight + 1 * padding,
    "      Bank Name: HSBC Hong Kong"
  );
  doc.text(
    100,
    finalY + padding + 5 * lineHeight + 1 * padding,
    "      Bank Code: 004"
  );
  doc.text(
    100,
    finalY + padding + 6 * lineHeight + 1 * padding,
    "      SWIFT: HSBCHKHHHKH"
  );
  doc.setFontType("italic");
  doc.text(
    100,
    finalY + padding + 7 * lineHeight + 1 * padding,
    "* For Cheques, please write your Invoice No. on the back of the cheque"
  );
  doc.text(
    100,
    finalY + padding + 8 * lineHeight + 1 * padding,
    "  and for the Back-in, please provide the Bank-In Slip to Petgo Trading Limited."
  );
  doc.setFontType("bold");
  doc.text(100, finalY + padding + 9 * lineHeight + 2 * padding, "OR");
  doc.text(
    100,
    finalY + padding + 10 * lineHeight + 3 * padding,
    "  2. Faster Payment System (FPS)"
  );
  doc.text(
    100,
    finalY + padding + 11 * lineHeight + 3 * padding,
    "      FPS Account: 166473439"
  );
  doc.setFontType("italic");
  doc.text(
    100,
    finalY + padding + 12 * lineHeight + 3 * padding,
    "* For FPS payment, please provide the FPS payment slip to Petgo Trading Limited"
  );
  doc.setFontType("bold");
  doc.text(100, finalY + padding + 13 * lineHeight + 4 * padding, "OR");
  doc.text(100, finalY + padding + 14 * lineHeight + 5 * padding, "  3. Cash");
  doc.setFontType("italic");
  doc.text(
    100,
    finalY + padding + 15 * lineHeight + 5 * padding,
    "* Cash On Delivery."
  );
  doc.setFontType("bold");

  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages(totalPagesExp);
  }
  doc.save(`INV-${invoice.code}.pdf`);
};

export default INVGenerator;
