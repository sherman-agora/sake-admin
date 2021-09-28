import React, { useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { useTranslate, usePermissions } from "react-admin";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { DatePicker } from "@material-ui/pickers";
import dayjs from "dayjs";

function BasicForm({ formData, setFormData }) {
  const translate = useTranslate();
  const { loaded, permissions } = usePermissions();
  let minDate;
  let defaultDay = dayjs();
  let selectedDay;
  const week = formData.salesOrder.shop.deliveryDay;

  if (!["admin"].includes(permissions)) {
    minDate = new Date();
    //check hours
    if (minDate.getHours() >= 16) {
      defaultDay = dayjs().add(1, "day").set("hour", 9);
      minDate.setDate(minDate.getDate() + 1);
    }

    // check customer shippment week
    const matchCaseWeek = week.filter((day) => {
      const currentDay = defaultDay.day();
      return currentDay <= day;
    });

    // auto force to next week
    if (matchCaseWeek.length == 0) {
      const nextWeekDay = week.map((day) => day + 6 + 1);
      defaultDay = dayjs().day(nextWeekDay[0]);
    } else {
      defaultDay = dayjs().day(matchCaseWeek[0]);
    }
  }
  useEffect(() => {
    setFormData({ ...formData, shipmentDate: defaultDay.toISOString() });
  }, defaultDay);
  console.log(formData.shipmentDate);

  return (
    <form noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <DatePicker
            minDate={minDate}
            format="ddd DD MMM YYYY"
            views={["year", "month", "date"]}
            inputVariant="filled"
            fullWidth
            value={formData.shipmentDate ? formData.shipmentDate : defaultDay}
            label={translate("invoice.shipmentDate")}
            onChange={(newDate) =>
              setFormData({ ...formData, shipmentDate: newDate.toISOString() })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="filled"
            fullWidth
            value={formData.code}
            label={translate("invoice.code")}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="form-state">
              {translate("invoice.state")}
            </InputLabel>
            <Select
              labelId={"state"}
              label="form-state"
              value={formData.state || "APPROVED"}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
            >
              {[{ id: "CONFIRMED", name: translate("common.confirmed") }].map(
                (d) => (
                  <MenuItem key={`POSelect${d.id}`} value={d.id}>
                    {d.name}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
}

export default BasicForm;
