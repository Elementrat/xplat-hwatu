"use client";

import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import STR from "../../strings/strings";

type MultiSelectOption = {
  readonly label: string;
  readonly value: string;
};

export const createOption = (label: string, details?: any) => ({
  label,
  value: label?.toLowerCase()?.replace(/\W/g, ""),
  color: details?.color || "rgba(0,0,0,.2)",
  details: { ...details }
});

const getSelectStyles = (isCreate) => {
  const styles = {
    menu: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "transparent",
      minWidth: "fit-content",
      position: isCreate ? "absolute" : "relative",
      marginTop: "0px",
      marginBottom: "0px",
      padding: "0px"
    }),
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      padding: "0px"
    }),
    control: (baseStyles, state) => ({
      cursor: "pointer",
      ...baseStyles,
      backgroundColor: isCreate ? `transparent` : `#2b3035`,
      color: "white",
      border: isCreate ? `none` : `1px solid rgba(255, 255, 255, 0.1)`
    }),
    container: (baseStyles, state) => ({
      ...baseStyles,
      flex: 1
    }),
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      color: "rgba(255, 255, 255, 0.3)",
      padding: "10px"
    }),
    clearIndicator: (baseStyles, state) => {
      const clearColor = "#495057";
      const clearColorFocused = "#adb5bd";
      return {
        ...baseStyles,
        display: isCreate ? "none" : `block`,
        color: clearColor,
        "&:hover": {
          color: clearColorFocused
        }
      };
    },
    indicatorsContainer: (baseStyles, state) => ({
      ...baseStyles
    }),
    multiValueRemove: (baseStyles, state) => ({
      ...baseStyles,
      marginLeft: "10px"
    }),
    input: (baseStyles, state) => ({
      ...baseStyles,
      color: "white",
      padding: "10px"
    }),
    valueContainer: (baseStyles, state) => ({
      ...baseStyles,
      color: "white"
    }),
    multiValue: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.data.color || "#212529",
      padding: "5px 10px"
    }),
    multiValueLabel: (baseStyles, state) => ({
      ...baseStyles,
      color: "white"
    }),
    value: (baseStyles, state) => ({
      ...baseStyles
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      padding: "10px",
      backgroundColor: state.isFocused ? `#212529` : `#15171a`,
      borderLeft: `3px solid ${state.data.color || "#212529"}`,
      borderTopLeftRadius: "5px",
      borderBottomLeftRadius: "5px",
      overflow: "hidden"
    }),
    noOptionsMessage: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: `#15171a`
    })
  };
  return styles;
};

const MultiSelect = ({
  knownOptions,
  initialValue,
  inputValue,
  onCreate,
  onRemoveValue,
  onClear,
  onSelectOption,
  onInputChange,
  onKeyDown,
  values,
  placeholder,
  createable
}) => {
  const [value, setValue] = useState<Array<MultiSelectOption> | null>(values);
  const [options, setOptions] = useState(knownOptions);

  useEffect(() => {
    setValue(values);
  }, [values]);

  useEffect(() => {
    setOptions(knownOptions);
  }, [knownOptions]);

  const onCreateOption = (e) => {
    if (onCreate) {
      const newOption = createOption(e);
      setOptions((prev) => [...prev, newOption]);
      setValue((cur) => {
        return [...cur, newOption];
      });
      onCreate(e);
    }
  };

  const onChange = (e, b) => {
    switch (b?.action) {
      case "clear":
        setValue([]);
        onInputChange("");
        onClear();
        break;
      case "select-option":
        {
          if (onSelectOption) {
            onSelectOption(b.option);
            const newValue = [...(value || []), b.option];
            setValue(newValue);
            if (onInputChange) {
              setTimeout(() => {
                onInputChange("");
              });
            }
          }
        }
        break;
      case "remove-value":
        {
          if (onRemoveValue) {
            onRemoveValue(b.removedValue.value);
            const newValue =
              value?.filter((e) => e.value !== b.removedValue.value) || [];
            setValue(newValue);
          }
        }
        break;
      case "create-option":
        {
          const newOption = createOption(b.option.value);
          setOptions((prev) => [...prev, newOption]);
        }
        break;
    }
  };

  const handleKeydown = (e) => {
    if (onKeyDown) {
      onKeyDown(e.target.value);
    }
  };

  const handleInputChange = (e, b) => {
    if (b.action === "input-blur" || b.action === "menu-close") {
      return;
    }
    if (onInputChange) {
      onInputChange(e);
    }
  };

  return createable ? (
    <CreatableSelect
      isMulti
      isSearchable
      inputValue={inputValue}
      name="colors"
      noOptionsMessage={() => STR.CREATE_TAG}
      options={options}
      placeholder={placeholder}
      className="basic-multi-select"
      classNamePrefix="select"
      onCreateOption={onCreateOption}
      onChange={onChange}
      value={value}
      styles={getSelectStyles(true)}
    />
  ) : (
    <Select
      isMulti
      isClearable={true}
      name="colors"
      noOptionsMessage={() => null}
      options={options}
      inputValue={inputValue}
      placeholder={placeholder}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange}
      styles={getSelectStyles(false)}
      onInputChange={handleInputChange}
      onKeyDown={handleKeydown}
      defaultInputValue={initialValue}
      value={value}
    />
  );
};

export { MultiSelect };
