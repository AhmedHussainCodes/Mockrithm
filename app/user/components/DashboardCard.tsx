import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardCardProps {
  title: string
  value: string | number
  description?: string
}

export function DashboardCard({ title, value, description }: DashboardCardProps) {
  return (
    <Card className="border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}