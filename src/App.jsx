import { useState } from 'react'
import Hero from './components/Hero'
import Uploader from './components/Uploader'
import Cards from './components/Cards'

function App() {
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const onProcessed = async (data) => {
    setResult(data)
    await refreshHistory()
  }

  const refreshHistory = async () => {
    try {
      const res = await fetch(`${backend}/api/projects`)
      const data = await res.json()
      setHistory(data.projects || [])
    } catch {}
  }

  const updateOutputs = async (outputs) => {
    const id = result?.id || result?.project?.id
    if (!id) return
    const res = await fetch(`${backend}/api/projects/${id}/update_outputs`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ outputs })
    })
    if (res.ok) setResult({ ...result, project: { ...(result.project || {}), outputs } })
  }

  const doExport = async (format) => {
    const id = result?.id || result?.project?.id
    const res = await fetch(`${backend}/api/projects/${id}/export`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ format })
    })
    const blob = await res.blob()
    const href = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = `export.${format}`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const doRegenerate = async (tone) => {
    const id = result?.id || result?.project?.id
    await fetch(`${backend}/api/projects/${id}/regenerate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tone, languages: ['en','pl'] })
    })
    // reload
    const res = await fetch(`${backend}/api/projects/${id}`)
    const data = await res.json()
    setResult({ project: data.project, id })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Hero />
      <Uploader onProcessed={onProcessed} />

      {!result && (
        <div className="max-w-6xl mx-auto p-6">
          <h2 className="text-xl font-semibold mb-3">Recent projects</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {history.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow p-4">
                <div className="text-sm text-gray-500">{p.source_type}</div>
                <div className="font-medium truncate">{p.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && (
        <Cards project={result} onUpdateOutputs={updateOutputs} onExport={doExport} onRegenerate={doRegenerate} />
      )}

      <footer className="py-10 text-center text-sm text-gray-500">Built for speed. EN + PL. 7 formats. Copy & export instantly.</footer>
    </div>
  )
}

export default App
