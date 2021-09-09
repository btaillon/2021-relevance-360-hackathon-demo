import "./FacetDropdown.scss";
import ChevronDownicon from "../icons/chevron-down.svg";
import {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
  SyntheticEvent,
} from "react";
import {
  buildFacet,
  Facet as HeadlessFacet,
  FacetOptions,
} from "@coveo/headless";
import EngineContext from "../common/engineContext";
import { Icon } from "./Icon";

interface FacetProps {
  controller: HeadlessFacet;
  defaultLabel: string;
}

const FacetDropdownRenderer: FunctionComponent<FacetProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);

  useEffect(
    () => controller.subscribe(() => setState(controller.state)),
    [controller]
  );

  const onSelect = (e: SyntheticEvent<HTMLSelectElement>) => {
    if (e.currentTarget.value === "") {
      controller.deselectAll();
    }
    const facetValue = state.values.find(
      (value) => value.value === e.currentTarget.value
    );
    if (!facetValue || facetValue.state === "selected") {
      return;
    }
    controller.toggleSingleSelect(facetValue);
  };

  const getSelectedValue = () =>
    state.values.find((value) => value.state === "selected");

  return (
    <div className="facet-dropdown">
      <select onChange={onSelect} value={getSelectedValue()?.value ?? ""}>
        <option value="">{props.defaultLabel}</option>
        {state.values.map((value) => (
          <option key={value.value} value={value.value}>
            {value.value}
          </option>
        ))}
      </select>
      <div className="icon-wrapper">
        <Icon icon={ChevronDownicon}></Icon>
      </div>
    </div>
  );
};

const FacetDropdown: FunctionComponent<{
  field: string;
  defaultLabel: string;
}> = ({ field, defaultLabel }) => {
  const options: FacetOptions = { field };
  const engine = useContext(EngineContext)!;
  const controller = buildFacet(engine, { options });
  return (
    <FacetDropdownRenderer
      controller={controller}
      defaultLabel={defaultLabel}
    />
  );
};

export default FacetDropdown;
