import axios from "axios";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { useParams } from "react-router-dom";
import { IconButton, Button } from "@material-tailwind/react";
import { NavbarComponent } from "../components/Navbar";
import { NavbarAuth } from "../components/NavbarAuth";
import Cookies from "js-cookie";

export default function JobDetail() {
  const { isState, isFunction } = useContext(GlobalContext);

  return (
    <>
      {!Cookies.get("token") && <NavbarComponent />}
      {Cookies.get("token") && <NavbarAuth />}

      <div className="px-5 py-5 md:px-32 flex flex-col md:min-h-dvh md:flex-row">
        <div className=" md:w-1/2">
          <img src={isState.dataDetail.company_image_url} alt="" />
        </div>
        <div className="md:flex md:flex-col md:gap-5 md:w-1/2">
          <h1 className="font-bold text-2xl">
            {isState.dataDetail.title} | {isState.dataDetail.company_name}
          </h1>
          <h1>
            <i className="fa-sharp fa-solid fa-location-dot"></i>{" "}
            {isState.dataDetail.company_city} | {isState.dataDetail.job_tenure}{" "}
            | {isState.dataDetail.job_type}
          </h1>
          <h1 className="font-bold text-black">
            Job Status:{" "}
            <span className="font-light">
              {isState.dataDetail.job_status === 1 ? "Open" : "Closed"}
            </span>
          </h1>
          <h1 className="font-bold text-black">
            Job Description:{" "}
            <span className="font-light">
              {isState.dataDetail.job_description}
            </span>
          </h1>
          <h1 className="font-bold text-black">
            Job Qualification:{" "}
            <span className="font-light">
              {isState.dataDetail.job_qualification}
            </span>
          </h1>
          <h1 className="font-bold text-black">
            Salary:{" "}
            <span className="font-black text-xl text-red-800">
              {isFunction.rupiah(isState.dataDetail.salary_min)} -{" "}
              {isFunction.rupiah(isState.dataDetail.salary_max)}
            </span>
          </h1>
          <div className="w-full flex gap-2">
            <IconButton
              onClick={() => isFunction.navigate("/job-vacancy")}
              className="flex flex-row px-5"
            >
              <i className="fas fa-arrow-left" />
            </IconButton>

            <Button onClick={() => isFunction.navigate("/")}>Apply</Button>
          </div>
        </div>
      </div>
    </>
  );
}
