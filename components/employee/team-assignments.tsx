"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Team } from "@/lib/types"
import { Users } from "lucide-react"

const teams: Team[] = [
  {
    id: 1,
    name: "North Zone Team",
    leadId: 1,
    memberIds: [2, 3, 4],
    assignedZone: "North",
  },
  {
    id: 2,
    name: "South Zone Team",
    leadId: 5,
    memberIds: [6, 7, 8],
    assignedZone: "South",
  },
]

export function TeamAssignments({ employeeId }: { employeeId: number }) {
  const { toast } = useToast()
  const [assignedTeams, setAssignedTeams] = useState<Team[]>(teams)

  const handleAssignTeam = async (formData: FormData) => {
    const newTeam: Team = {
      id: assignedTeams.length + 1,
      name: formData.get("name") as string,
      leadId: employeeId,
      memberIds: [],
      assignedZone: formData.get("zone") as string,
    }

    // In a real app, this would be an API call
    setAssignedTeams([...assignedTeams, newTeam])
    toast({
      title: "Team Created",
      description: "The new team has been successfully created.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Assignments</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Team</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <form action={(formData) => handleAssignTeam(formData)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Team Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zone">Assigned Zone</Label>
                <Select name="zone">
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North Zone</SelectItem>
                    <SelectItem value="south">South Zone</SelectItem>
                    <SelectItem value="east">East Zone</SelectItem>
                    <SelectItem value="west">West Zone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Create Team</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Teams</CardTitle>
          <CardDescription>View and manage team assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedTeams.map((team) => (
              <div key={team.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <p className="font-medium">{team.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Zone: {team.assignedZone} • Members: {team.memberIds.length + 1}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Manage Team
                  </Button>
                  <Button variant="outline" size="sm">
                    View Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

