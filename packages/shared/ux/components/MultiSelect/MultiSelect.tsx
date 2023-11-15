"use client";

import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import STR from "../../strings/strings";

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label?.toLowerCase()?.replace(/\W/g, "")
});

const getSelectStyles = (isCreate) => {
  const styles = {
    menu: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "black",
      minWidth: "fit-content",
      position: isCreate ? "absolute" : "relative"
    }),
    control: (baseStyles, state) => ({
      cursor: "pointer",
      ...baseStyles,
      border: "none",
      backgroundColor: "transparent",
      color: "white"
    }),
    container: (baseStyles, state) => ({
      ...baseStyles,
      minWidth: "175px"
    }),
    input: (baseStyles, state) => ({
      ...baseStyles,
      color: "white"
    }),
    valueContainer: (baseStyles, state) => ({
      ...baseStyles,
      color: "white"
    }),
    multiValue: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: "rgba(0,0,0,.5)"
    }),
    multiValueLabel: (baseStyles, state) => ({
      ...baseStyles,
      color: "white"
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isFocused
        ? "rgba(255,255,255,.1)"
        : "rgba(0,0,0,.5)"
    })
  };
  return styles;
};

const MultiSelect = ({
  knownOptions,
  initialValue,
  onCreate,
  onRemoveValue,
  onSelectOption,
  onInputChange,
  onKeyDown,
  values,
  placeholder,
  createable
}) => {
  const [value, setValue] = useState<Array<Option> | null>(values);
  const [options, setOptions] = useState(knownOptions);

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
      case "select-option":
        {
          if (onSelectOption) {
            onSelectOption(b.option);
            const newValue = [...(value || []), b.option];
            setValue(newValue);
            onInputChange("");
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

  const handleInputChange = (e) => {
    if (onInputChange) {
      onInputChange(e);
    }
  };

  return createable ? (
    <CreatableSelect
      isMulti
      isSearchable
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
      name="colors"
      noOptionsMessage={() => null}
      options={options}
      placeholder={placeholder}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={onChange}
      styles={getSelectStyles(false)}
      onInputChange={handleInputChange}
      onKeyDown={handleKeydown}
      defaultInputValue={initialValue}
    />
  );
};

export { MultiSelect };
