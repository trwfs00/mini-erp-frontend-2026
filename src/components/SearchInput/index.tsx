import { TextInput, type TextInputProps } from "@mantine/core";
import { SearchIcon } from "lucide-react";
import type { FC } from "react";

type Props = Omit<TextInputProps, "value" | "onChange" | "onKeyPress"> & {
  value: string;
  onSearch: (value: string) => void;
};

export const SearchInput: FC<Props> = ({
  value,
  onSearch,
  w = 350,
  ...rest
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onSearch(event.currentTarget.value);
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  };

  return (
    <TextInput
      leftSection={<SearchIcon size={16} color="black" />}
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      w={w}
      {...rest}
    />
  );
};
