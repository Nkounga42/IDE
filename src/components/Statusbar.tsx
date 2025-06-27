import { Bell, BellDot } from "lucide-react";

const Statusbar = ({
  inspector,
  notifications,
  notificationVisible,
  setNotificationVisible,
}: {
  inspector: { html: number; css: number };
  notifications: number;
  notificationVisible: boolean;
  setNotificationVisible: (visible: boolean) => void;
}) => {
  return (
    <div className="h-6 px-4 flex items-center justify-between text-[12px] bg-base-300 text-base-content border-t border-base-200">
      <div className="space-x-2">
        <span>HTML: {inspector.html}</span>
        <span>CSS: {inspector.css}</span>
      </div>
      <div className="flex items-center space-x-2 tooltip tooltip-top">
        <button
          className="btn btn-sm btn-ghost h-6 w-6 rounded-none p-0 tooltip tooltip-left " data-tip={`${notifications} notifications`}
          onClick={() => setNotificationVisible(!notificationVisible)}
        >
          {notifications > 0 ? <BellDot size={13} /> : <Bell size={13} />} 
        </button> 
      </div>
    </div>
  );
};


export default Statusbar

/**
 * languages with only basic syntax colorization
TypeScript
JavaScript
CSS
LESS
SCSS
JSON
HTML 
XML
PHP
C#
C++
Razor
Markdown
Diff
Java
VB
CoffeeScript
Handlebars
Batch
Pug
F#
Lua
Powershell
Python
Ruby
SASS
R
Objective-C
 */