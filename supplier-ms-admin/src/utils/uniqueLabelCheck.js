function uniqueLabelCheck({ input, backendData }) {
  console.log("backend Data: ", backendData);
  console.log("input: ", input);
  const dataBool = [];
  backendData.forEach(({ labelFrom, labelTo }, index) => {
    dataBool[index] = { labelFrom: false, labelTo: false };

    if (input.labelFrom > labelTo) {
      dataBool[index].labelFrom = true;
    }
    if (input.labelTo > labelTo) {
      dataBool[index].labelTo = true;
    }
    console.log({ labelFrom, labelTo });
    console.log(dataBool[index]);
  });
  const res = dataBool.find(
    ({ labelFrom, labelTo }) => labelFrom === true && labelTo === true
  );
  console.log("res: --", res);
  return res == undefined;
}

export default uniqueLabelCheck;
