import { Progress } from "@/components/ui/progress"

interface ProgressDemoProps {
  value: number
  className?: string
}

export function ProgressDemo({ value, className }: ProgressDemoProps) {
  return <Progress value={value} className={className} />
}

