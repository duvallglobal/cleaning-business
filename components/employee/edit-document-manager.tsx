"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Document } from "@/lib/types"
import { FileText, Plus, Pencil, Trash, Upload } from "lucide-react"

interface EditDocumentManagerProps {
  employeeId: number
  documents: Document[]
  onUpdate: (documents: Document[]) => Promise<void>
}

export function EditDocumentManager({ employeeId, documents, onUpdate }: EditDocumentManagerProps) {
  const { toast } = useToast()
  const [docs, setDocs] = useState<Document[]>(documents)
  const [isEditing, setIsEditing] = useState(false)
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddDocument = async (formData: FormData) => {
    const newDoc: Document = {
      id: docs.length > 0 ? Math.max(...docs.map((d) => d.id)) + 1 : 1,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      uploadDate: new Date().toISOString().split("T")[0],
      url: "/documents/new-doc.pdf",
      status: "valid",
    }

    const updatedDocs = [...docs, newDoc]
    setDocs(updatedDocs)

    try {
      await onUpdate(updatedDocs)
      toast({
        title: "Document Added",
        description: "The document has been successfully uploaded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditDocument = async (formData: FormData) => {
    if (!currentDoc) return

    const updatedDoc: Document = {
      ...currentDoc,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as "valid" | "expired" | "pending",
    }

    const updatedDocs = docs.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc))

    setDocs(updatedDocs)
    setIsEditing(false)
    setCurrentDoc(null)

    try {
      await onUpdate(updatedDocs)
      toast({
        title: "Document Updated",
        description: "The document has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDocument = async (docId: number) => {
    setIsLoading(true)

    const updatedDocs = docs.filter((doc) => doc.id !== docId)
    setDocs(updatedDocs)

    try {
      await onUpdate(updatedDocs)
      toast({
        title: "Document Deleted",
        description: "The document has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Documents</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <form action={(formData) => handleAddDocument(formData)} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Document Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Document Type</Label>
                <Select name="type">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identification">Identification</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" name="file" type="file" required />
              </div>
              <Button type="submit">Upload Document</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Documents</CardTitle>
          <CardDescription>View and manage employee documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <p className="font-medium">{doc.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Type: {doc.type} • Uploaded: {doc.uploadDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={doc.status}
                    onChange={(e) => {
                      const updatedDocs = docs.map((d) =>
                        d.id === doc.id ? { ...d, status: e.target.value as "valid" | "expired" | "pending" } : d,
                      )
                      setDocs(updatedDocs)
                      onUpdate(updatedDocs)
                    }}
                    className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                  >
                    <option value="valid">Valid</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                  </select>
                  <Dialog
                    open={isEditing && currentDoc?.id === doc.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setIsEditing(false)
                        setCurrentDoc(null)
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentDoc(doc)
                          setIsEditing(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Document</DialogTitle>
                      </DialogHeader>
                      <form action={(formData) => handleEditDocument(formData)} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-name">Document Name</Label>
                          <Input id="edit-name" name="name" defaultValue={currentDoc?.name} required />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-type">Document Type</Label>
                          <Select name="type" defaultValue={currentDoc?.type}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="identification">Identification</SelectItem>
                              <SelectItem value="certification">Certification</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-status">Status</Label>
                          <Select name="status" defaultValue={currentDoc?.status}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="valid">Valid</SelectItem>
                              <SelectItem value="expired">Expired</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit">Update Document</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteDocument(doc.id)} disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            ))}
            {docs.length === 0 && (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">No documents found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

