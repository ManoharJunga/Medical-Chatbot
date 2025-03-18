import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"

interface ProfileHeaderProps {
  user: {
    name: string
    email: string
    isVerified: boolean
    isApproved: boolean
    createdAt: string | Date | null | undefined
  }
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "N/A"

    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) return "Invalid Date"

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsedDate)
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white p-6 rounded-lg shadow-sm border">
      <Avatar className="h-24 w-24">
        <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
        {user ? (
          <AvatarFallback className="text-2xl">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        ) : (
          <AvatarFallback className="text-2xl">?</AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {user.isVerified ? (
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-500 border-amber-500">
                Not Verified
              </Badge>
            )}

            {user.isApproved ? (
              <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                Approved
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">
                Pending Approval
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center mt-2 text-gray-500 text-sm">
          <CalendarDays className="h-4 w-4 mr-1" />
          <span>Member since {formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
