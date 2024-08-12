import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function useDocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    let title;

    if (location.pathname === "/" || location.pathname === "/index.html") {
      title = "HairHub - Home";
    } else {
      const formattedPath = location.pathname
        .replace("/", "")
        .replace(/-/g, " ");
      title =
        "HairHub - " +
        formattedPath.charAt(0).toUpperCase() +
        formattedPath.slice(1);
    }

    document.title = title;
  }, [location]);
}

export default useDocumentTitle;
