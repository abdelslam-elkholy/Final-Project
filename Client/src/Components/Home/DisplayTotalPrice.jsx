import React from "react";
import { styled } from "@mui/material/styles";
// import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
import "./DisplayTotalPrice.css";
import { useTranslation } from "react-i18next";
export default function DisplayTotalPrice() {
  const { t, i18n } = useTranslation();

  //======================= style function =======================
  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 52,
    height: 32,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(20px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#222",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 27,
      height: 27,
    },
    "& .MuiSwitch-track": {
      borderRadius: 50 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#000",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));
  return (
    <>
      <div className="container-fluid my-3 row justify-content-center align-items-center p-0 mx-0 ">
        <div
          id="subheader"
          className=" border border-dark-subtle p-3 mx-auto col-lg-6 col-md-10"
          style={{ borderRadius: "10px" }}
        >
          <div className="d-flex justify-content-between">
            <div id="subheader2" className="d-flex">
              <p className="h6 m-0 my-auto pe-2"> {t("totalprice")} </p>
              <p
                id="subheader3"
                className="m-0 my-auto border-start ps-2 text-body-secondary"
              >
                {t("include")}
              </p>
            </div>
            <FormControlLabel
              control={<IOSSwitch sx={{ m: 0 }} defaultChecked />}
            />
          </div>
        </div>
      </div>
    </>
  );
}
