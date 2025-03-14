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
import { Users, Pencil, Trash } from "lucide-react"

interface EditTeamAssignmentsProps {
  employeeId: number
}

export function EditTeamAssignments({ employeeId }: EditTeamAssignmentsProps) {
  const { toast } = useToast()
  const [teams, setTeams] = useState<Team[]>([
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
  ])
  const [isEditing, setIsEditing] = useState(false)
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateTeam = async (formData: FormData) => {
    const newTeam: Team = {
      id: teams.length > 0 ? Math.max(...teams.map((t) => t.id)) + 1 : 1,
      name: formData.get("name") as string,
      leadId: employeeId,
      memberIds: [],
      assignedZone: formData.get("zone") as string,
    }

    const updatedTeams = [...teams, newTeam]
    setTeams(updatedTeams)

    toast({
      title: "Team Created",
      description: "The new team has been successfully created.",
    })
  }

  const handleEditTeam = async (formData: FormData) => {
    if (!currentTeam) return

    const updatedTeam: Team = {
      ...currentTeam,
      name: formData.get("name") as string,
      assignedZone: formData.get("zone") as string,
    }

    const updatedTeams = teams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))

    setTeams(updatedTeams)
    setIsEditing(false)
    setCurrentTeam(null)

    toast({
      title: "Team Updated",
      description: "The team has been successfully updated.",
    })
  }

  const handleDeleteTeam = async (teamId: number) => {
    setIsLoading(true)

    const updatedTeams = teams.filter((team) => team.id !== teamId)
    setTeams(updatedTeams)

    toast({
      title: "Team Deleted",
      description: "The team has been successfully deleted.",
    })

    setIsLoading(false)
  }

  const handleAddMember = (teamId: number, memberId: number) => {
    const updatedTeams = teams.map((team) => {
      if (team.id === teamId && !team.memberIds.includes(memberId)) {
        return {
          ...team,
          memberIds: [...team.memberIds, memberId],
        }
      }
      return team
    })

    setTeams(updatedTeams)

    toast({
      title: "Member Added",
      description: "The member has been successfully added to the team.",
    })
  }

  const handleRemoveMember = (teamId: number, memberId: number) => {
    const updatedTeams = teams.map((team) => {
      if (team.id === teamId) {
        return {
          ...team,
          memberIds: team.memberIds.filter((id) => id !== memberId),
        }
      }
      return team
    })

    setTeams(updatedTeams)

    toast({
      title: "Member Removed",
      description: "The member has been successfully removed from the team.",
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
            <form action={(formData) => handleCreateTeam(formData)} className="space-y-4">
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
            {teams.map((team) => (
              <div key={team.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
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
                    <Dialog
                      open={isEditing && currentTeam?.id === team.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setIsEditing(false)
                          setCurrentTeam(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentTeam(team)
                            setIsEditing(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Team</DialogTitle>
                        </DialogHeader>
                        <form action={(formData) => handleEditTeam(formData)} className="space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-name">Team Name</Label>
                            <Input id="edit-name" name="name" defaultValue={currentTeam?.name} required />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-zone">Assigned Zone</Label>
                            <Select name="zone" defaultValue={currentTeam?.assignedZone}>
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
                          <Button type="submit">Update Team</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteTeam(team.id)} disabled={isLoading}>
                      <Trash className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium">Team Members</h4>
                  <div className="mt-2 space-y-2">
                    <div className="rounded-md bg-muted p-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Team Lead</span>
                        <span>Employee #{team.leadId}</span>
                      </div>
                    </div>
                    {team.memberIds.length > 0 ? (
                      team.memberIds.map((memberId) => (
                        <div key={memberId} className="flex items-center justify-between rounded-md bg-muted p-2">
                          <span>Employee #{memberId}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(team.id, memberId)}>
                            Remove
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-10 items-center justify-center rounded-md border border-dashed">
                        <p className="text-sm text-muted-foreground">No team members</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <Label htmlFor={`add-member-${team.id}`}>Add Team Member</Label>
                    <div className="mt-2 flex gap-2">
                      <Select onValueChange={(value) => handleAddMember(team.id, Number.parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">John Doe</SelectItem>
                          <SelectItem value="3">Jane Smith</SelectItem>
                          <SelectItem value="4">Bob Johnson</SelectItem>
                          <SelectItem value="5">Alice Williams</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">Add</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {teams.length === 0 && (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">No teams found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

