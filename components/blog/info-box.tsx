import { InfoBoxComponent } from "@/lib/storyblok-types";

interface InfoBoxProps {
  component: InfoBoxComponent;
}

const bgColorClasses = {
  info: "bg-blue-50 border-blue-200 text-blue-900",
  link: "bg-gray-50 border-gray-200 text-gray-900",
  success: "bg-green-50 border-green-200 text-green-900",
  warning: "bg-cream border-yellow-200 text-dark-navy",
  danger: "bg-red-50 border-red-200 text-red-900",
};

export function InfoBox({ component }: InfoBoxProps) {
  const { title, information, bg_color = "info" } = component;
  const colorClass = bgColorClasses[bg_color] || bgColorClasses.info;

  return (
    <div className={`rounded-lg p-6 my-6 border-2 ${colorClass}`}>
      {title && <p className="text-lg font-bold mb-3 mt-0">{title}</p>}
      {information && (
        <div className="text-base leading-relaxed">{information}</div>
      )}
    </div>
  );
}
