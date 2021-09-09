import "./Icon.scss";
import { FunctionComponent, useState } from "react";

export const Icon: FunctionComponent<{ icon: string }> = ({ icon }) => {
  const [svg, setSvg] = useState("");

  fetch(icon).then(async (response) => {
    if (response.status === 200 || response.status === 304) {
      setSvg(await response.text());
    }
  });

  return <div className="icon" dangerouslySetInnerHTML={{ __html: svg }}></div>;
};
