import React from "react";
import SupplierAutocomplete from "../../../components/Inputs/SupplierAutocomplete";
import { DatePicker } from "@material-ui/pickers";
import InputLabel from "@material-ui/core/InputLabel";
import { useTranslate } from "react-admin";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { PO_FREEZE_STATE } from "../constants";

function BasicForm({ formData, setFormData, permissions }) {
  const translate = useTranslate();
  const today = new Date();

  return (
    <form noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <SupplierAutocomplete
            variant="filled"
            fullWidth
            value={formData.supplier}
            label={translate("purchaseOrder.code")}
            onChange={(newValue) =>
              setFormData({ ...formData, supplier: newValue })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="filled"
            fullWidth
            value={formData.code}
            label={translate("purchaseOrder.code")}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            minDate={today}
            inputVariant="filled"
            fullWidth
            value={formData.expectedDeliveryAt}
            label={translate("purchaseOrder.expectedDeliveryAt")}
            onChange={(newDate) =>
              setFormData({ ...formData, expectedDeliveryAt: newDate.toDate() })
            }
            format="YYYY/MM/DD"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="form-state">
              {translate("purchaseOrder.state")}
            </InputLabel>
            <Select
              disabled={PO_FREEZE_STATE.includes(formData.state)}
              labelId={"state"}
              label="form-state"
              value={formData.state || "APPROVED"}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
            >
              {[
                { id: "DRAFT", name: translate("common.draft") },
                { id: "PENDING", name: translate("common.pending") },
              ].map((d) => (
                <MenuItem key={`POSelect${d.id}`} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
              {permissions === "admin" && (
                <MenuItem key="POSelectAPPROVED" value="APPROVED">
                  {" "}
                  {translate("common.approved")}
                </MenuItem>
              )}
              {/* <MenuItem key="POSelectAPPROVED" value="APPROVED"> */}
              {/* {" "} */}
              {/* {translate("common.approved")} */}
              {/* </MenuItem> */}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
}

export default BasicForm;
