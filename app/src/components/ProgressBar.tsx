interface ProgressBarProps {
  activeIndex: number
  total: number
}

export default function ProgressBar({ activeIndex, total }: ProgressBarProps) {
  return (
    <div className="fixed bottom-12 left-0 w-full z-40 px-6 md:px-12">
      <div className="flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-[2px] flex-1 transition-all duration-500"
            style={{
              backgroundColor: i <= activeIndex ? '#3B5BFF' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
