import { StylesConfig } from "react-select";

export const getCustomSelectStyles = (
  width: string,
): StylesConfig<any, false> => ({
  control: (provided) => ({
    ...provided,
    width,
    height: "48px",
    backgroundColor: "#F7F7FB",
    borderRadius: "14px",
    border: "none",
    boxShadow: "none",
    paddingLeft: "8px",
    fontFamily: "inherit",
    fontSize: "18px",
    fontWeight: "500",
    color: "#121417",
    cursor: "pointer",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#121417",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#121417",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 8px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "#121417",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
    transition: "transform 0.2s ease",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#FFFFFF",
    borderRadius: "14px",
    border: "1px solid rgba(18, 20, 23, 0.05)",
    boxShadow: "0px 4px 36px 0px rgba(0, 0, 0, 0.02)",
    padding: "8px",
    zIndex: 100,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "272px",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(18, 20, 23, 0.05)",
      borderRadius: "10px",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    color: state.isSelected ? "#121417" : "rgba(18, 20, 23, 0.2)",
    fontSize: "16px",
    fontWeight: "500",
    padding: "8px 12px",
    cursor: "pointer",
    "&:hover": {
      color: "#121417",
      backgroundColor: "rgba(18, 20, 23, 0.03)",
    },
  }),
});
