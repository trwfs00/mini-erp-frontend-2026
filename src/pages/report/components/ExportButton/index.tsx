import { Button } from "@mantine/core";
import { Download } from "lucide-react";
import { useState } from "react";
import type { FC } from "react";
import type { ApiReturn } from "@/types/api/ApiReturn";
import { ExportUtil } from "@/utils/ExportUtil";
import { LanguageUtil } from "@/utils/LanguageUtil";
import { tReport } from "@/consts/translations/tReport";

type Props = {
  label: string;
  filename: string;
  disabled?: boolean;
  onExport: () => Promise<ApiReturn<Blob>>;
  onError?: (message: string) => void;
};

export const ExportButton: FC<Props> = ({ label, filename, disabled, onExport, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await onExport();
    setLoading(false);

    if (!res.ok || !res.data) {
      onError?.(res.message ?? LanguageUtil.getText(tReport.unableGenerateFile));
      return;
    }

    ExportUtil.downloadBlob(res.data, filename);
  };

  return (
    <Button
      leftSection={<Download size={16} />}
      variant="filled"
      loading={loading}
      disabled={disabled}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};
