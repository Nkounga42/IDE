import { Bell, BellDot, Binary, Braces } from "lucide-react";

const Statusbar = ({
  cursorLine,
  cursorCol,
  language,
  theme,
  charCount,
  inspector,
  notifications,
  notificationVisible,
  setNotificationVisible,
  lineNumbers,
}: {
  lineNumbers: string[];
  inspector: { html: number; css: number };
  charCount: number;
  notifications: number;
  notificationVisible: boolean;
  setNotificationVisible: (visible: boolean) => void;
}) => {
  return (
    <div className="h-6 px-4 flex items-center justify-between   bg-base-100 text-base-content text-sm border-t border-base-200">
      <div className="space-x-5 flex">
        <span className="flex gap-1 items-center justify-center">Ligne : {cursorLine}</span>
        <span className="flex gap-1 items-center justify-center">Colonne : {cursorCol}</span>
        <span className="flex gap-1 items-center justify-center"><Braces size={13}  /> {language}</span>
        <span className="flex gap-1 items-center justify-center"> <Binary size={13}  /> UTF-8</span>
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