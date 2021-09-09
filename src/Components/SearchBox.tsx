import "./SearchBox.scss";
import SearchIcon from "../icons/search.svg";
import { FunctionComponent, useEffect, useState, useContext } from "react";
import {
  buildSearchBox,
  SearchBox as HeadlessSearchBox,
  SearchBoxOptions,
} from "@coveo/headless";
import EngineContext from "../common/engineContext";
import { Icon } from "./Icon";

interface SearchBoxProps {
  controller: HeadlessSearchBox;
}

const SearchBoxRenderer: FunctionComponent<SearchBoxProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);

  useEffect(
    () => controller.subscribe(() => setState(controller.state)),
    [controller]
  );

  return (
    <div className="searchbox">
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => controller.updateText(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && controller.submit()}
        value={state.value}
      />
      <button onClick={() => controller.submit()}>
        <Icon icon={SearchIcon}></Icon>
      </button>
    </div>
  );
};

const SearchBox = () => {
  const options: SearchBoxOptions = { numberOfSuggestions: 8 };
  const engine = useContext(EngineContext)!;
  const controller = buildSearchBox(engine, { options });
  return <SearchBoxRenderer controller={controller} />;
};

export default SearchBox;
