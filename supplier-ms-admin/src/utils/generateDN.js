import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import lodash from "lodash";
import "./msjh-normal";

const DNGenerator = ({ deliveryNote }) => () => {
  var now = dayjs();
  let data = [];
  let col = [
    { dataKey: "count", header: "Item" },
    { dataKey: "no", header: "Product No" },
    { dataKey: "des", header: "Description" },
    { dataKey: "lbl", header: "Labels" },
    { dataKey: "exDate", header: "Expiry Date" },
    { dataKey: "qty", header: "Qty" },
  ];

  var doc = new jsPDF("p", "pt");
  doc.page = 1;
  var totalPagesExp = "{total_pages_count_string}";
  var width = doc.internal.pageSize.getWidth();
  var height = doc.internal.pageSize.getHeight();
  const paddingTop = 50;

  var header = function () {
    var str = doc.internal.getNumberOfPages().toString();
    if (typeof doc.putTotalPages === "function") {
      str = str + " of " + totalPagesExp;
    }
    doc.setFontSize(23);
    doc.setFontStyle("bold");
    doc.text(width - 250, 50, "DELIVERY NOTE");
    doc.setFontSize(10);
    doc.setFontStyle("bold");
    doc.text(50, paddingTop + 80, "Ship To:");
    doc.text(50, paddingTop + 145, "Attn:");
    doc.text(50, paddingTop + 160, "Tel:");
    doc.text(200, paddingTop + 160, "Fax:");
    doc.setFontStyle("normal");
    doc.setFont("msjh");
    doc.text(100, paddingTop + 80, deliveryNote.salesOrder.shop.nameEn);
    doc.setFont("msjh");
    doc.text(100, paddingTop + 95, deliveryNote.salesOrder.shop.deliverAddress);
    doc.setFont("helvetica");
    doc.text(100, paddingTop + 110, "");
    doc.text(100, paddingTop + 125, "");
    doc.setFontStyle("normal");
    doc.setFont("msjh");
    doc.text(
      100,
      paddingTop + 145,
      deliveryNote.salesOrder.shop.customer.nameEn
    );
    doc.text(
      100,
      paddingTop + 160,
      deliveryNote.salesOrder.shop.phone
        ? deliveryNote.salesOrder.shop.phone.toString()
        : ""
    );
    doc.text(
      250,
      paddingTop + 160,
      deliveryNote.salesOrder.shop.phone
        ? deliveryNote.salesOrder.shop.phone.toString()
        : ""
    );

    doc.setFontStyle("bold");
    doc.text(50, paddingTop + 180, "Bill To:");
    doc.setFontStyle("normal");
    doc.setFont("msjh");
    doc.text(100, paddingTop + 180, deliveryNote.salesOrder.shop.nameEn);
    doc.setFont("msjh");
    doc.text(
      100,
      paddingTop + 195,
      deliveryNote.salesOrder.shop.deliverAddress
    );
    doc.text(100, paddingTop + 210, "");
    doc.text(100, paddingTop + 225, "");
    doc.setFont("helvetica");
    doc.setFontStyle("normal");
    doc.text(50, paddingTop + 245, "Attn:");
    doc.setFontStyle("normal");
    doc.setFont("msjh");
    doc.text(
      100,
      paddingTop + 245,
      deliveryNote.salesOrder.shop.customer.nameEn
    );
    doc.setFont("helvetica");
    doc.setFontStyle("bold");
    doc.text(50, paddingTop + 260, "Tel:");
    doc.setFontStyle("normal");
    doc.text(
      100,
      paddingTop + 260,
      deliveryNote.salesOrder.shop.phone
        ? deliveryNote.salesOrder.shop.phone.toString()
        : ""
    );
    doc.setFontStyle("bold");
    doc.text(200, paddingTop + 260, "Fax:");
    doc.setFontStyle("normal");
    // doc.text(250, 260, deliveryNote.customer.mobile)
    doc.text(
      250,
      paddingTop + 260,
      deliveryNote.salesOrder.shop.phone
        ? deliveryNote.salesOrder.shop.phone.toString()
        : ""
    );

    doc.setFontStyle("bold");
    doc.text(400, paddingTop + 100, "Date:");
    doc.setFontStyle("normal");
    doc.text(460, paddingTop + 100, now.format("DD/MMM/YYYY"));
    doc.setFontStyle("bold");
    doc.text(400, paddingTop + 115, "REF. No.:");
    doc.setFontStyle("normal");
    doc.text(460, paddingTop + 115, deliveryNote.code);
    doc.setFontStyle("bold");
    doc.text(400, paddingTop + 130, "Cust. ID:");
    doc.setFontStyle("normal");
    doc.text(460, paddingTop + 130, deliveryNote.salesOrder.shop.customer.code);
    doc.setFontStyle("bold");
    doc.text(400, paddingTop + 145, "Pay term:");
    doc.setFontStyle("normal");
    doc.text(460, paddingTop + 145, "");
    doc.setFontStyle("bold");
    doc.text(400, paddingTop + 160, "Ship Date:");
    doc.setFontStyle("normal");
    doc.text(460, paddingTop + 100, now.format("DD/MMM/YYYY"));
    doc.text(460, paddingTop + 115, deliveryNote.code);
    doc.text(460, paddingTop + 130, deliveryNote.salesOrder.shop.customer.code);
    doc.text(460, paddingTop + 145, "");
    doc.text(
      460,
      paddingTop + 160,
      dayjs(deliveryNote.invoice.shipmentDate).format("DD/MMM/YYYY")
    );
    doc.setFontStyle("bold");
    doc.text(400, paddingTop + 175, "Salesman:");
    doc.setFontStyle("normal");
    doc.text(460, paddingTop + 175, "");
    doc.setFontStyle("bold");
    doc.text(400, paddingTop + 190, "Page:");
    doc.setFontStyle("normal");
    doc.text(460, paddingTop + 190, str);

    doc.setLineWidth(1.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(50, paddingTop + 270, width - 50, paddingTop + 270);
    doc.line(50, paddingTop + 290, width - 50, paddingTop + 290);
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
      no: { columnWidth: 70 },
      des: { columnWidth: 180 },
      lbl: { columnWidth: 90 },
      exDate: { columnWidth: 80 },
      qty: { columnWidth: 40 },
    },
    styles: { font: "msjh", fontStyle: "normal" },
    headStyles: {
      fillColor: false,
      textColor: "black",
      fontStyle: "bold",
      font: "helvetica",
    },
    style: { cellWidth: "auto" },
    margin: { top: paddingTop + 270, bottom: 210, horizontal: 50 },
  };

  const groupedItems = lodash.groupBy(deliveryNote.items, "product.code");
  const items = Object.values(groupedItems).map((array) => {
    const result = array.reduce((a, b) => {
      const itemA = dayjs(a.item.expiryDate);
      const itemB = dayjs(b.item.expiryDate);
      return Math.abs(itemB - now) < Math.abs(itemA - now) ? b : a;
    });
    result.qty = array.length;
    result.labels = array.map((a) => a.item.label).join(", ");
    return result;
  });
  items.map((value, index) => {
    let b = {
      count: index + 1,
      no: value.product.code,
      des: `${value.product.nameEn}\n${value.product.nameChi}`,
      lbl: value.labels,
      qty: value.qty,
      exDate: dayjs(value.item.expiryDate).format("DD/MMM/YYYY"),
    };
    if (!!value.product.printInDN) {
      data.push(b);
    }
  });
  console.log("data_json", data);
  doc.autoTable(col, data, options);
  doc.setFontSize(10);
  doc.setFontStyle("normal");
  doc.setFontSize(8);
  doc.text(
    350,
    doc.autoTable.previous.finalY + 40,
    "RECEIVED THE ABOVE IN GOOD CONDITIONS :"
  );
  doc.line(
    350,
    doc.autoTable.previous.finalY + 110,
    width - 50,
    doc.autoTable.previous.finalY + 110
  );
  doc.text(
    350,
    doc.autoTable.previous.finalY + 120,
    "COMPANY CHOP & AUTHORIZED SIGNATURE :"
  );
  doc.setLineWidth(1.5);
  doc.setDrawColor(0, 0, 0);
  doc.line(
    50,
    doc.autoTable.previous.finalY + 6,
    width - 50,
    doc.autoTable.previous.finalY + 6
  );
  doc.line(
    50,
    doc.autoTable.previous.finalY + 21,
    width - 50,
    doc.autoTable.previous.finalY + 21
  );

  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages(totalPagesExp);
  }
  doc.save(`DN-${deliveryNote.code}.pdf`);
};
export default DNGenerator;
