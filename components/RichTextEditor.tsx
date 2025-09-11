'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Undo,
  Redo
} from 'lucide-react'
import { useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const RichTextEditor = ({ content, onChange, placeholder = "Start writing your article..." }: RichTextEditorProps) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-red hover:text-primary-red-light underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[400px] p-4 focus:outline-none text-dark-text',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 min-h-[500px] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary-red border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-primary-red text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href
    setLinkUrl(previousUrl || '')
    setShowLinkDialog(true)
  }

  const setLink = () => {
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    }
    setShowLinkDialog(false)
    setLinkUrl('')
  }

  return (
    <div className="bg-dark-card rounded-xl border border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-700 p-3">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 mr-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold"
            >
              <Bold size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic"
            >
              <Italic size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              title="Inline Code"
            >
              <Code size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              isActive={editor.isActive('highlight')}
              title="Highlight"
            >
              <Highlighter size={18} />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 mr-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <Heading1 size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              <Heading3 size={18} />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 mr-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote size={18} />
            </ToolbarButton>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 mr-4">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              title="Align Left"
            >
              <AlignLeft size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight size={18} />
            </ToolbarButton>
          </div>

          {/* Media */}
          <div className="flex items-center gap-1 mr-4">
            <ToolbarButton onClick={addLink} title="Add Link">
              <LinkIcon size={18} />
            </ToolbarButton>
            <ToolbarButton onClick={addImage} title="Add Image">
              <ImageIcon size={18} />
            </ToolbarButton>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              title="Undo"
            >
              <Undo size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              title="Redo"
            >
              <Redo size={18} />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose prose-invert max-w-none"
        />
        {editor.isEmpty && (
          <div className="absolute top-4 left-4 text-gray-500 pointer-events-none text-base">
            {placeholder}
          </div>
        )}
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-dark-text mb-4">Add Link</h3>
            <input
              type="url"
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-primary-red focus:ring-1 focus:ring-primary-red"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setLink()
                } else if (e.key === 'Escape') {
                  setShowLinkDialog(false)
                  setLinkUrl('')
                }
              }}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowLinkDialog(false)
                  setLinkUrl('')
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={setLink}
                className="px-4 py-2 bg-primary-red hover:bg-primary-red-light text-white rounded-lg transition-all duration-200"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RichTextEditor
