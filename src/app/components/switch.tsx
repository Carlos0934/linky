"use client";

type SwitchProps = {
  checked?: boolean;
  onChange?: (on: boolean) => void;
  label?: string;
  className?: string;
};

export default function Switch({
  checked,
  label,
  onChange,
  className,
}: SwitchProps) {
  return (
    <label
      role="switch"
      className={`relative flex items-center transition-colors duration-300 ease-in-out  ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange?.(!checked)}
        className="sr-only peer"
      />
      <div className="w-14 h-7 inline-block border-2 border-gray-600 peer-checked:border-blue-600 bg-gray-800 rounded-full peer-checked:bg-blue-600 after:peer-checked:translate-x-7 after:content-[''] after:w-6 after:h-6 after:inline-block after:bg-white after:rounded-full after:shadow-md after:transform after:transition-transform after:duration-300 after:ease-in-out"></div>

      {label && <span className="ml-2 text-gray-300">{label}</span>}
    </label>
  );
}
