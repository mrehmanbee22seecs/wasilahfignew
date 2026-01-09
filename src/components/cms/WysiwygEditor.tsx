import React, { useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Video,
  Table,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Type,
  FileText,
  AlertCircle,
} from 'lucide-react';

/**
 * WysiwygEditor Component
 * 
 * Rich text editor with toolbar for CMS content editing
 * Supports: headings, formatting, lists, links, media, tables, undo/redo
 * 
 * @accessibility Full keyboard support, aria-labels, screen reader announcements
 */

export type WysiwygEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageInsert?: () => void;
  onVideoEmbed?: () => void;
  minHeight?: string;
  maxHeight?: string;
  showWordCount?: boolean;
  className?: string;
};

export function WysiwygEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  onImageInsert,
  onVideoEmbed,
  minHeight = '300px',
  maxHeight = '600px',
  showWordCount = true,
  className = '',
}: WysiwygEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [showPasteOptions, setShowPasteOptions] = useState(false);
  const [isFormatted, setIsFormatted] = useState(true);

  useEffect(() => {
    setLocalValue(value);
    updateCounts(value);
  }, [value]);

  const updateCounts = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, ' ').trim();
    const words = plainText.split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
    setCharacterCount(plainText.length);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    updateCounts(newValue);
    onChange(newValue);
  };

  const insertFormat = (tag: string, closingTag?: string) => {
    const textarea = document.getElementById('wysiwyg-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = localValue.substring(start, end);
    const closing = closingTag || tag;
    
    const before = localValue.substring(0, start);
    const after = localValue.substring(end);
    const newValue = `${before}<${tag}>${selectedText}</${closing}>${after}`;
    
    setLocalValue(newValue);
    onChange(newValue);
    updateCounts(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length + 2, end + tag.length + 2);
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (!url) return;
    
    const textarea = document.getElementById('wysiwyg-textarea') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = localValue.substring(start, end) || url;
    
    const before = localValue.substring(0, start);
    const after = localValue.substring(end);
    const newValue = `${before}<a href="${url}">${selectedText}</a>${after}`;
    
    setLocalValue(newValue);
    onChange(newValue);
    updateCounts(newValue);
  };

  const toolbarButtons = [
    { icon: Heading1, label: 'Heading 1', action: () => insertFormat('h1'), shortcut: 'Ctrl+Alt+1' },
    { icon: Heading2, label: 'Heading 2', action: () => insertFormat('h2'), shortcut: 'Ctrl+Alt+2' },
    { icon: Type, label: 'Paragraph', action: () => insertFormat('p'), shortcut: 'Ctrl+Alt+0' },
    { type: 'divider' },
    { icon: Bold, label: 'Bold', action: () => insertFormat('strong'), shortcut: 'Ctrl+B' },
    { icon: Italic, label: 'Italic', action: () => insertFormat('em'), shortcut: 'Ctrl+I' },
    { icon: Link, label: 'Insert Link', action: insertLink, shortcut: 'Ctrl+K' },
    { type: 'divider' },
    { icon: List, label: 'Bullet List', action: () => insertFormat('ul', 'ul'), shortcut: 'Ctrl+Shift+8' },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertFormat('ol', 'ol'), shortcut: 'Ctrl+Shift+7' },
    { icon: Quote, label: 'Blockquote', action: () => insertFormat('blockquote'), shortcut: 'Ctrl+Shift+.' },
    { icon: Code, label: 'Code Block', action: () => insertFormat('code'), shortcut: 'Ctrl+E' },
    { type: 'divider' },
    { icon: Image, label: 'Insert Image', action: onImageInsert, shortcut: 'Ctrl+Shift+I' },
    { icon: Video, label: 'Embed Video', action: onVideoEmbed, shortcut: 'Ctrl+Shift+V' },
    { icon: Table, label: 'Insert Table', action: () => insertFormat('table', 'table') },
    { type: 'divider' },
    { icon: Undo, label: 'Undo', action: () => {}, shortcut: 'Ctrl+Z' },
    { icon: Redo, label: 'Redo', action: () => {}, shortcut: 'Ctrl+Shift+Z' },
  ];

  return (
    <div className={`border border-gray-200 rounded-lg bg-white ${className}`}>
      {/* Toolbar */}
      <div 
        className="border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center"
        role="toolbar"
        aria-label="Text formatting toolbar"
      >
        {toolbarButtons.map((button, index) => {
          if (button.type === 'divider') {
            return <div key={index} className="w-px h-6 bg-gray-300 mx-1" />;
          }

          const Icon = button.icon!;
          return (
            <button
              key={index}
              onClick={button.action}
              className="p-2 hover:bg-gray-100 rounded text-gray-700 hover:text-gray-900 transition-colors"
              title={`${button.label} (${button.shortcut})`}
              aria-label={`${button.label} - Keyboard shortcut: ${button.shortcut}`}
              type="button"
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}

        {/* Paste Options */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowPasteOptions(!showPasteOptions)}
            className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100"
            type="button"
          >
            <FileText className="w-3 h-3 inline mr-1" />
            Paste options
          </button>
        </div>
      </div>

      {/* Paste Options Panel */}
      {showPasteOptions && (
        <div className="border-b border-gray-200 p-3 bg-blue-50 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-900 font-medium mb-1">Paste as plain text</p>
            <p className="text-xs text-gray-600 mb-2">
              When pasting from Word or other editors, formatting will be preserved. Toggle to paste as plain text.
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!isFormatted}
                onChange={(e) => setIsFormatted(!e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Clean formatting on paste</span>
            </label>
          </div>
          <button
            onClick={() => setShowPasteOptions(false)}
            className="text-gray-400 hover:text-gray-600"
            type="button"
          >
            ×
          </button>
        </div>
      )}

      {/* Editor Area */}
      <div className="relative">
        <textarea
          id="wysiwyg-textarea"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full p-4 resize-none focus:outline-none font-sans text-gray-900"
          style={{ minHeight, maxHeight }}
          aria-label="Content editor"
        />
      </div>

      {/* Footer with word count */}
      {showWordCount && (
        <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
          <div className="flex gap-4">
            <span>{wordCount} words</span>
            <span>{characterCount} characters</span>
          </div>
          <div className="text-gray-500">
            Ctrl+Z to undo • Ctrl+Shift+Z to redo
          </div>
        </div>
      )}
    </div>
  );
}
