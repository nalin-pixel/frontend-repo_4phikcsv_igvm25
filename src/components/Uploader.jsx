import { useState } from 'react'

export default function Uploader({ onProcessed }) {
  const [url, setUrl] = useState('')
  const [tone, setTone] = useState('premium')
  const [loading, setLoading] = useState(false)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleUrl = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/process/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, tone, languages: ['en','pl'] })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to process URL')
      onProcessed(data)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('tone', tone)
      const res = await fetch(`${backend}/api/process/upload`, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to process file')
      onProcessed(data)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto -mt-16 relative z-20">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            placeholder="Paste brochure link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="border rounded-lg px-3 py-3" value={tone} onChange={(e)=>setTone(e.target.value)}>
            <option value="premium">Premium</option>
            <option value="aggressive">Aggressive</option>
            <option value="simple">Simple</option>
            <option value="storytelling">Storytelling</option>
          </select>
          <button onClick={handleUrl} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-3 disabled:opacity-60">{loading ? 'Processing...' : 'Generate'}</button>
        </div>
        <div className="mt-4">
          <label className="block text-sm text-gray-600 mb-1">Or upload PDF / JPG / PNG</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} className="block w-full" />
        </div>
      </div>
    </div>
  )
}
