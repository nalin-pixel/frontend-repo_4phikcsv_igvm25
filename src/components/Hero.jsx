import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/LU2mWMPbF3Qi1Qxh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-6 sm:p-10 shadow-xl pointer-events-none max-w-3xl text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900">Auto-Explainer for Developers</h1>
          <p className="mt-4 text-gray-700 text-sm sm:text-base">Upload a brochure or paste a link. Get instant, sales-ready content in EN + PL across 7 formats. Clean, fast, and clear.</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white pointer-events-none" />
    </section>
  )
}
