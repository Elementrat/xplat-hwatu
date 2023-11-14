"use client";

import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import STR from "../../strings/strings";

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label?.toLowerCase()?.replace(/\W/g, "")
});

const MultiSelect = ({
  knownOptions,
  onClear,
  onCreate,
  onDeselectOption,
  onRemoveValue,
  onSelectOption,
  values
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
            const newValue = [...value, b.option];
            setValue(newValue);
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
  return (
    <CreatableSelect
      isMulti
      name="colors"
      noOptionsMessage={() => STR.CREATE_TAG}
      options={options}
      placeholder="Tags"
      className="basic-multi-select"
      classNamePrefix="select"
      onCreateOption={onCreateOption}
      onChange={onChange}
      value={value}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          border: "none",
          backgroundColor: "transparent",
          color: "white",
          minWidth: "150px"
        }),
        container: (baseStyles, state) => ({
          ...baseStyles
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
        })
      }}
    />
  );
};

export { MultiSelect };