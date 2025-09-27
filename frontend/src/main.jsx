import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "remixicon/fonts/remixicon.css";
import {Toaster} from "react-hot-toast";

createRoot(document.getElementById("root")).render(
	<>
		<App />
		<Toaster position="top-right" />
	</>
);
