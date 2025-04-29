import Cookie from "js-cookie";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { formatDate } from "./lib/utils";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000/api/v1/"
    : "https://airbnbclone-sloz.onrender.com/api/v1/";

console.log("[API] Using backend URL:", BASE_URL);

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Initialize CSRF token
export const initializeCSRF = async () => {
  try {
    await instance.get("init/");
    console.log("CSRF token initialized");
  } catch (error) {
    console.error("Failed to initialize CSRF token:", error);
  }
};

// Add request interceptor to set CSRF token
instance.interceptors.request.use(async (config) => {
  const csrfToken = Cookie.get("csrftoken");
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  } else {
    // If no CSRF token, try to initialize it
    await initializeCSRF();
    const newToken = Cookie.get("csrftoken");
    if (newToken) {
      config.headers["X-CSRFToken"] = newToken;
    }
  }
  return config;
});

// Add response interceptor for handling authentication errors
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    console.error("[API] Response error:", error);
    // Skip retry for CSRF endpoint to prevent loops
    if (error.config?.url === "csrf/") {
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      console.error("[API] Authentication error (403):", error.response?.data);
      try {
        await instance.get("csrf/");
        const originalRequest = error.config;
        return instance(originalRequest);
      } catch (retryError) {
        console.error("[API] Failed to refresh CSRF token:", retryError);
        return Promise.reject(retryError);
      }
    }
    return Promise.reject(error);
  }
);

export const getRooms = () =>
  instance.get("rooms/").then((response) => response.data);

export const getRoom = ({ queryKey }: QueryFunctionContext) => {
  const [, roomPk] = queryKey;
  return instance.get(`rooms/${roomPk}`).then((response) => response.data);
};

export const getRoomReviews = ({ queryKey }: QueryFunctionContext) => {
  const [_, roomPk] = queryKey;
  return instance
    .get(`rooms/${roomPk}/reviews`)
    .then((response) => response.data);
};

export const getMe = async () => {
  try {
    console.log("[API] Attempting to fetch user data");
    const response = await instance.get(`users/me`);
    console.log("[API] Successfully fetched user data");
    return response.data;
  } catch (error: any) {
    console.error("[API] Error fetching user data:", error);
    if (error.response?.status === 403) {
      console.error("[API] Authentication error in getMe");
      // Try to get a new CSRF token
      try {
        const response = await instance.get(""); // Make a request to get a new CSRF token
        console.log("[API] Got new CSRF token, retrying getMe");
        return instance.get(`users/me`).then((response) => response.data);
      } catch (retryError) {
        console.error("[API] Failed to get new CSRF token:", retryError);
        throw retryError;
      }
    }
    throw error;
  }
};

export const logOut = () =>
  instance
    .post(`users/log-out`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const githubLogIn = async (code: string) => {
  console.log("[API] Attempting GitHub login with code");
  try {
    const csrftoken = Cookie.get("csrftoken");
    console.log("[API] CSRF Token:", csrftoken ? "Present" : "Missing");

    const response = await instance.post(
      "/users/github",
      { code },
      {
        headers: {
          "X-CSRFToken": csrftoken || "",
        },
      }
    );
    console.log("[API] GitHub login response:", response.status);
    return { status: response.status, error: null };
  } catch (error: any) {
    console.error("[API] GitHub login error:", error);
    // 백엔드에서 내려주는 에러 메시지 추출
    const errorMsg =
      error?.response?.data?.error || error.message || "Unknown error";
    console.error("[API] Error message:", errorMsg);
    return {
      status: error?.response?.status || 400,
      error: errorMsg,
    };
  }
};

export const kakaoLogin = (code: string) =>
  instance
    .post(
      `/users/kakao`,
      { code },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.status);

export interface IUsernameLoginVariables {
  username: string;
  password: string;
}
export interface IUsernameLoginSuccess {
  ok: string;
}
export interface IUsernameLoginError {
  error: string;
}
export const usernameLogIn = ({
  username,
  password,
}: IUsernameLoginVariables) =>
  instance
    .post(
      `/users/log-in`,
      { username, password },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

interface ISignUpVariables {
  name: string;
  email: string;
  username: string;
  password: string;
  currency: string;
  gender: string;
  language: string;
}
export const SignUp = ({
  username,
  password,
  email,
  name,
  currency,
  gender,
  language,
}: ISignUpVariables) =>
  instance
    .post(
      `users/`,
      { username, password, email, name, currency, gender, language },
      {
        headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" },
      }
    )
    .then((response) => response.data);
export const getAmenities = () =>
  instance.get(`rooms/amenities`).then((response) => response.data);
export const getCategories = () =>
  instance.get(`categories`).then((response) => response.data);

export interface IUploadRoomVariables {
  name: string;
  country: string;
  city: string;
  price: number;
  rooms: number;
  toilets: number;
  description: string;
  address: string;
  pet_friendly: boolean;
  kind: string;
  amenities: number[];
  category: number;
}

// export interface IEditRoomVariables {
//   roomPk: string;
//   name: string;
//   country: string;
//   city: string;
//   price: number;
//   rooms: number;
//   toilets: number;
//   description: string;
//   address: string;
//   pet_friendly: boolean;
//   kind: string;
//   amenities: number[];
//   category: number;
// }

// export interface IUploadError {
//   response: { data: { error: string } };
// }

export const uploadRoom = (variables: IUploadRoomVariables) =>
  instance
    .post(`rooms/`, variables, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const getUploadURL = () =>
  instance
    .post(`medias/photos/get-url`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export interface IUploadImageVarialbes {
  file: FileList;
  uploadURL: string;
}
export const uploadImage = ({ file, uploadURL }: IUploadImageVarialbes) => {
  const form = new FormData();
  form.append("file", file[0]);
  return axios
    .post(uploadURL, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

export interface ICreatePhotoVariables {
  description: string;
  file: string;
  roomPk: string;
}

export const createPhoto = ({
  description,
  file,
  roomPk,
}: ICreatePhotoVariables) =>
  instance
    .post(
      `rooms/${roomPk}/photos`,
      { description, file },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

// export const editRoom = (variables: IEditRoomVariables) =>
//   instance
//     .put(`rooms/${variables.roomPk}`, variables, {
//       headers: {
//         "X-CSRFToken": Cookie.get("csrftoken") || "",
//       },
//     })
//     .then((response) => response.data);

type CheckBookingQueryKey = [string, string?, Date[]?];

export const checkBooking = ({
  queryKey,
}: QueryFunctionContext<CheckBookingQueryKey>) => {
  const [_, roomPk, dates] = queryKey;
  if (dates) {
    const [firstDate, secondDate] = dates;
    const checkIn = formatDate(firstDate);
    const checkOut = formatDate(secondDate);
    return instance
      .get(
        `rooms/${roomPk}/bookings/check?check_in=${checkIn}&check_out=${checkOut}`
      )
      .then((response) => response.data);
  }
};

export default instance;
