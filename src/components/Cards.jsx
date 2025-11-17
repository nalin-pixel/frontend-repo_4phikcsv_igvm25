import { useState } from 'react'

function SectionCard({ title, value, onCopy, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value || '')

  const save = () => {
    setEditing(false)
    onEdit(text)
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <button onClick={() => { navigator.clipboard.writeText(text); onCopy && onCopy() }} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">Copy</button>
          {editing ? (
            <button onClick={save} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Save</button>
          ) : (
            <button onClick={() => setEditing(true)} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">Edit</button>
          )}
        </div>
      </div>
      {editing ? (
        <textarea className="w-full border rounded p-2 min-h-[140px]" value={text} onChange={(e)=>setText(e.target.value)} />
      ) : (
        <pre className="whitespace-pre-wrap text-sm text-gray-700">{text}</pre>
      )}
    </div>
  )
}

export default function Cards({ project, onUpdateOutputs, onExport, onRegenerate }) {
  const [lang, setLang] = useState('en')

  const sections = [
    { key: 'instagram_post', title: 'Instagram Post' },
    { key: 'facebook_post', title: 'Facebook Post' },
    { key: 'reels_script', title: 'Reels/TikTok Script' },
    { key: 'whatsapp_short', title: 'WhatsApp' },
    { key: 'selling_points', title: 'Selling Points' },
    { key: 'qa', title: 'Q&A' },
    { key: 'sales_call_script', title: 'Sales Call Script' },
  ]

  const outputs = project?.project?.outputs || project?.outputs || {}
  const current = outputs[lang] || {}

  const updateSection = (key, text) => {
    const next = { ...outputs, [lang]: { ...current, [key]: text } }
    onUpdateOutputs(next)
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3 items-center">
          <select value={lang} onChange={(e)=>setLang(e.target.value)} className="border rounded px-3 py-2">
            <option value="en">EN</option>
            <option value="pl">PL</option>
          </select>
          <select defaultValue={project?.project?.tone || project?.tone} onChange={(e)=>onRegenerate(e.target.value)} className="border rounded px-3 py-2">
            <option value="premium">Premium</option>
            <option value="aggressive">Aggressive</option>
            <option value="simple">Simple</option>
            <option value="storytelling">Storytelling</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>onExport('txt')} className="bg-gray-900 text-white px-4 py-2 rounded">Export .txt</button>
          <button onClick={()=>onExport('pdf')} className="bg-gray-900 text-white px-4 py-2 rounded">Export .pdf</button>
          <button onClick={()=>onExport('docx')} className="bg-gray-900 text-white px-4 py-2 rounded">Export .docx</button>
          <button onClick={()=>onExport('json')} className="bg-gray-900 text-white px-4 py-2 rounded">Export .json</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map(s => (
          <SectionCard key={s.key} title={s.title} value={current[s.key]} onEdit={(text)=>updateSection(s.key, text)} />
        ))}
      </div>
    </div>
  )
}
