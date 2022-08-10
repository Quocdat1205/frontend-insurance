
import axios from "axios";
import Config from "config/config";
import merge from "lodash/merge";


const mandatory = () => {
    return Promise.reject(new Error("Fetch API Missing parameter!"));
};
const API_URL = Config.env.API_URL;
const FetchApi = async (
    { url, options, params, cancelToken, timeout }: any = mandatory(),
    cb: any = (f: any) => f
) => {
    try {
        const defaultOptions = {
            method: "GET",
            baseURL: API_URL,
            url,
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            cancelToken,
            timeout,
        };

        const opts = merge(defaultOptions, options);
        if (opts && opts.method === "GET") {
            opts.params = params;
        } else {
            opts.data = params;
        }

        if (process.env.NODE_ENV !== "production") {
            // console.log('Call API: url, options, params', opts, options);
        }

        const { data }: any = await axios(opts);
        cb(null, data);
        return data;
    } catch (err: any) {
        if (process.env.NODE_ENV !== "production") {
            // console.error('Call API Error: ', err, err?.response?.data);
        }
        if (err?.response?.data) {
            return err?.response?.data;
        }
        cb(err);
        return Promise.reject(err);
    }
};

export default FetchApi;
