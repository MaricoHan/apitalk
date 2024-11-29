import { type Language } from '@/config/i18n';

interface Props {
  language: Language;
  onChange: (language: Language) => void;
}

export default function LanguageToggle({ language, onChange }: Props) {
  return (
    <select
      value={language}
      onChange={(e) => onChange(e.target.value as Language)}
      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <option value="zh">中文</option>
      <option value="en">English</option>
    </select>
  );
}
