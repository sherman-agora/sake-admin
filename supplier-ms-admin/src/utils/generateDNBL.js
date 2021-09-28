import jsPDF from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import lodash from "lodash";
import img from "./logo_without_address.png";
import "./msjh-normal";

const DNBLGenerator = ({ deliveryNote }) => () => {
  var now = dayjs();

  var doc = new jsPDF("p", "pt", "tabloid");
  doc.page = 1;
  var totalPagesExp = "{total_pages_count_string}";
  var width = doc.internal.pageSize.getWidth();
  var height = doc.internal.pageSize.getHeight();

  var header = (boxNum, boxTotal) => () => {
    doc.setLineWidth(2);
    doc.setDrawColor(0);
    // Logo
    var imageEle = new Image();
    imageEle.src = img;
    doc.addImage(imageEle, "PNG", 30, 10, 300, 115);
    doc.setFontSize(12);
    doc.text(
      50,
      95,
      "Unit C, 14/F, Bold Win Industrial Building, 16-18 Wah Sing Street"
    );
    doc.text(50, 110, "Tel:(852) 2328 6565 Fax:(852) 2328 6909");
    // Ship Date
    doc.setFontSize(18);
    doc.setFont("msjh");
    doc.setFontStyle("normal");
    doc.text(500, 30, "送貨日期：");

    doc.setFont("helvetica");
    doc.setFontStyle("bold");
    doc.text(
      610,
      30,
      dayjs(deliveryNote.invoice.shipmentDate).format("DD/MMM/YYYY")
    );

    // Invoice Number and Packing Number Rect
    doc.rect(30, 130, 400, 100);
    doc.setFontSize(22);
    doc.setFontStyle("normal");
    doc.setFont("msjh");
    doc.text(40, 160, "單號：");
    doc.text(40, 210, "裝箱單號：");
    doc.setFont("helvetica");
    doc.setFontStyle("bold");
    doc.text(170, 160, deliveryNote.invoice.code);
    doc.text(170, 210, deliveryNote.code);

    // Box Number Rect
    doc.rect(450, 130, 310, 100);
    doc.setFontSize(40);
    doc.setFontStyle("normal");
    doc.setFont("msjh");
    doc.text(460, 200, "箱：");
    doc.setFont("helvetica");
    doc.setFontStyle("bold");
    doc.text(530, 200, boxNum + " / " + boxTotal);

    // Shipment Details Rect
    doc.rect(30, 240, 730, 260);
    doc.setFontSize(24);
    doc.setFontStyle("normal");
    doc.setFont("msjh");
    doc.text(40, 270, "公司：");
    doc.text(40, 310, "商店：");
    doc.text(40, 350, "送貨地址：");
    doc.text(40, 430, "電話：");
    doc.text(40, 470, "備註：");
    doc.text(170, 270, deliveryNote.salesOrder.shop.customer.nameChi);
    doc.text(170, 310, deliveryNote.salesOrder.shop.nameChi);
    doc.text(170, 350, deliveryNote.salesOrder.shop.deliverAddress);
    doc.text(
      170,
      430,
      deliveryNote.salesOrder.shop.phone
        ? deliveryNote.salesOrder.shop.phone.toString()
        : ""
    );
    doc.text(170, 470, deliveryNote.salesOrder.shop.customer.remark || "");
  };

  var footer = function () {
    // doc.setFontSize(7);
    // doc.text(width - 40, height - 30, "Page - " + doc.page);
    // doc.page++;
  };

  // Products
  const groupedItems = lodash.groupBy(deliveryNote.items, "boxNum");
  const groupedValues = Object.values(groupedItems);
  const numOfBoxes = groupedValues.length;
  let notPrintingProducts = {};
  const options = {
    afterPageContent: footer,
    theme: "grid",
    columnStyles: {
      productCode: { columnWidth: 70 },
      productName: { columnWidth: 240 },
      label: { columnWidth: 190, valign: "center" },
      unit: { columnWidth: 70, valign: "center" },
      expiryDate: { columnWidth: 155, valign: "center" },
    },
    styles: {
      font: "msjh",
      fontStyle: "normal",
      halign: "center",
    },
    headStyles: {
      textColor: "black",
      fillColor: false,
      lineColor: [0, 0, 0],
      lineWidth: 1,
      fontSize: 23,
    },
    bodyStyles: {
      textColor: "black",
      lineColor: [0, 0, 0],
      lineWidth: 1,
      fontSize: 23,
    },
    style: {
      textColor: "black",
      cellWidth: "auto",
      fontStyle: "normal",
      font: "msjh",
    },
    margin: { top: 520, bottom: 150, horizontal: 30 },
  };

  groupedValues.forEach((values, i) => {
    console.log("value, ", values);
    options.beforePageContent = header(i + 1, numOfBoxes);
    const data = values.reduce((pre, value) => {
      const temp = {
        productCode: value.product.code,
        productName: value.product.nameChi,
        label: value.item.label,
        unit: "1",
        expiryDate: dayjs(value.item.expiryDate).format("DD/MMM/YYYY"),
      };
      console.log("value.product.printInLabel: ", value.product.printInLabel);
      if (value.product.printInLabel === true || value.product.printInLabel === null) {
        pre.push(temp);
        return pre;
      } else {
        if (!!notPrintingProducts[temp.productCode]) {
          notPrintingProducts[temp.productCode].unit = `${parseInt(notPrintingProducts[temp.productCode].unit) + 1
            }`;
        } else {
          notPrintingProducts[temp.productCode] = { ...temp, label: " " };
        }
      }

      return pre;
    }, []);
    const mergedData = data.concat(Object.values(notPrintingProducts));
    console.log("data_json", mergedData);

    let col = [
      { dataKey: "productCode", header: "產品編號" },
      { dataKey: "productName", header: "產品描述" },
      { dataKey: "label", header: "標纖" },
      { dataKey: "unit", header: "數量" },
      { dataKey: "expiryDate", header: "到期日" },
    ];
    doc.autoTable(col, mergedData, options);
    if (i < groupedValues.length - 1) {
      doc.addPage("tabloid", "p");
    }
    notPrintingProducts = {};
  });

  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages(totalPagesExp);
  }
  doc.save(`PL-${deliveryNote.code}.pdf`);
};
export default DNBLGenerator;
