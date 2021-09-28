import { parseInt } from "lodash";

const numberAfter = (invoiceNumber, increment = 1) => {
  if (!invoiceNumber) throw new Error("invoiceNumber cannot be empty");
  const array = invoiceNumber.split(/[_/:\-;\\]+/);
  const lastSegment = array.pop();
  const priorSegment = invoiceNumber.substr(
    0,
    invoiceNumber.indexOf(lastSegment)
  );
  const nextNumber = [...Array(increment)].reduce(
    (result) => alphaNumericIncrementer(result),
    lastSegment
  );
  return priorSegment + nextNumber;
};

const labelNumberAfter = (labelNumber, increment = 1) => {
  console.log("labelNumber: ", labelNumber);
  console.log("increment: ", increment);
  // if (!labelNumber.match(/^[A-Z]{2}\d{10}$]/))
  // throw new Error("invoiceNumber cannot be empty");
  const alphabet = labelNumber.substr(0, 2);
  const number = parseInt(labelNumber.substr(2), 10) + increment;
  return `${alphabet}${number.toString().padStart(10, "0")}`;
};

const alphaNumericIncrementer = (str) => {
  if (!str || str.length === 0) {
    return "";
  }

  let invNum = str.replace(/([^a-z0-9]+)/gi, "");
  invNum = invNum.toUpperCase();
  let index = invNum.length - 1;

  while (index >= 0) {
    if (invNum.substr(index, 1) === "9") {
      invNum = invNum.substr(0, index) + "0" + invNum.substr(index + 1);
    } else if (invNum.substr(index, 1) === "Z") {
      invNum = invNum.substr(0, index) + "A" + invNum.substr(index + 1);
    } else {
      const char = String.fromCharCode(invNum.charCodeAt(index) + 1);
      invNum = invNum.substr(0, index) + char + invNum.substr(index + 1);
      index = 0;
    }
    index--;
  }
  return invNum;
};

export default {
  numberAfter,
  labelNumberAfter,
};
