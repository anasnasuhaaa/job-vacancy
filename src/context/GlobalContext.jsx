import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
const GlobalContext = createContext();

export function GlobalProvider(props) {
  let token = Cookies.get("token");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(true);
  const [dataDetail, setDataDetail] = useState();
  const [currentId, setCurrentId] = useState(-1);
  // const [identity, setIdentity] = useState([]);
  const [inputLogin, setInputLogin] = useState({
    email: "",
    password: "",
    name: "",
    image_url: "",
  });
  const [inputChangePassword, setInputChangePassword] = useState({
    current_password: "",
    new_password: "",
    new_confirm_password: "",
  });
  const [input, setInput] = useState({
    title: "",
    job_description: "",
    job_qualification: "",
    job_type: "",
    job_tenure: "",
    job_status: "",
    company_name: "",
    company_image_url: "",
    company_city: "",
    salary_min: "",
    salary_max: "",
  });
  const [search, setSearch] = useState("");
  const [whatSearch, setWhatSearch] = useState(0);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    e.target.name === "title" ? setWhatSearch(1) : setWhatSearch(0);
  };
  // Login
  const hanldeInputLogin = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInputLogin({ ...inputLogin, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    let { email, password } = inputLogin;
    axios
      .post("https://dev-example.sanbercloud.com/api/login", {
        email,
        password,
      })
      .then((res) => {
        let data = res.data;
        Cookies.set("token", data.token, { expires: 1 });
        localStorage.setItem("identity", JSON.stringify(data.user));
        navigate("/");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Welcome ${data.user.name}`,
          showConfirmButton: false,
          timer: 1200,
        });
        setTimeout(() =>{
          location.reload()
        },1200)
        // location.reload();
      })
      .catch((error) =>
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Account Not Registered!",
        })
      );
    // End Login
  };
  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("token");
        localStorage.removeItem("identity");
        isFunction.navigate("/");
        Swal.fire({
          title: "Success Logout!",
          text: "Your account has been logout.",
          icon: "success",
        });
      }
    });
  };
  let identity = localStorage.getItem("identity");
  let dataIdentity = JSON.parse(identity);

  const handleRegister = (e) => {
    e.preventDefault();
    let { email, password, name, image_url } = inputLogin;
    axios
      .post("https://dev-example.sanbercloud.com/api/register", {
        email,
        password,
        name,
        image_url,
      })
      .then((res) => {
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  const handleInputChangePassword = (e) => {
    const { name, value } = e.target;
    setInputChangePassword({ ...inputChangePassword, [name]: value });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://dev-example.sanbercloud.com/api/change-password",
        inputChangePassword,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        Swal.fire({
          title: "Success Change Password!",
          icon: "success",
          showConfirmButton: false,
        });
        navigate("/");
      })
      .catch((err) =>
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "The input data doesn't match, check again!",
        })
      );
  };

  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  useEffect(() => {
    axios
      .get("https://dev-example.sanbercloud.com/api/job-vacancy")
      .then((res) => {
        setData(res.data.data);
      });
  }, [fetchStatus, setFetchStatus]);

  const handleDetail = (event) => {
    setDataDetail(event);
    navigate(`/job-vacancy/${event.id}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleDelete = async (e) => {
    let idData = e.currentTarget.value;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .delete(
              `https://dev-example.sanbercloud.com/api/job-vacancy/${idData}`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
              navigate(`/list-job-vacancy`);
              location.reload();
            });
        } catch (err) {
          console.log("Error on submit", err.message);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const handleReset = () => {
    setInput({
      title: "",
      job_description: "",
      job_qualification: "",
      job_type: "",
      job_tenure: "",
      job_status: "",
      company_name: "",
      company_image_url: "",
      company_city: "",
      salary_min: "",
      salary_max: "",
    });
  };
  const handleEdit = (e) => {
    let idData = e.currentTarget.value;
    setCurrentId(idData);
    axios
      .get(`https://dev-example.sanbercloud.com/api/job-vacancy/${idData}`)
      .then((res) => {
        let data = res.data;
        navigate(`/list-job-vacancy/edit/${idData}`);
        setInput({
          title: data.title,
          job_description: data.job_description,
          job_qualification: data.job_qualification,
          job_type: data.job_type,
          job_tenure: data.job_tenure,
          job_status: data.job_status,
          company_name: data.company_name,
          company_image_url: data.company_image_url,
          company_city: data.company_city,
          salary_min: data.salary_min,
          salary_max: data.salary_max,
        });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentId === -1) {
        await axios.post(
          "https://dev-example.sanbercloud.com/api/job-vacancy",
          input,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          title: "Succes Add Job!",
          text: "You clicked the button!",
          icon: "success",
        });
        setTimeout(() => {
          navigate("/list-job-vacancy");
          location.reload();
        }, 1500);
      } else {
        await axios.put(
          `https://dev-example.sanbercloud.com/api/job-vacancy/${currentId}`,
          input,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire({
          title: "Success Update!",
          icon: "success",
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate("/list-job-vacancy");
          location.reload();
        }, 1500);
      }
      setCurrentId(-1);
      setInput({
        title: "",
        job_description: "",
        job_qualification: "",
        job_type: "",
        job_tenure: "",
        job_status: "",
        company_name: "",
        company_image_url: "",
        company_city: "",
        salary_min: "",
        salary_max: "",
      });

      setFetchStatus(true);
    } catch (err) {
      console.log("Error on submit", err.message);
    }
  };

  let isState = {
    identity,
    data,
    fetchStatus,
    dataDetail,
    input,
    inputLogin,
    inputChangePassword,
    search,
    whatSearch,
    dataIdentity,
  };
  let isFunction = {
    handleDetail,
    setDataDetail,
    navigate,
    rupiah,
    setInput,
    handleInput,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleReset,
    hanldeInputLogin,
    handleLogin,
    handleRegister,
    handleChangePassword,
    handleInputChangePassword,
    handleSearch,
    handleLogout,
  };

  return (
    <GlobalContext.Provider
      value={{
        isState,
        isFunction,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}

export default GlobalContext;
