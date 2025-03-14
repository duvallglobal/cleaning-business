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
import { FileText, Plus, Upload } from "lucide-react"

export function DocumentManager({
  employeeId,
  documents,
}: {
  employeeId: number
  documents: Document[]
}) {
  const { toast } = useToast()
  const [docs, setDocs] = useState<Document[]>(documents)

  const handleAddDocument = async (formData: FormData) => {
    const newDoc: Document = {
      id: docs.length + 1,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      uploadDate: new Date().toISOString().split("T")[0],
      url: "/documents/new-doc.pdf",
      status: "valid",
    }

    // In a real app, this would be an API call
    setDocs([...docs, newDoc])
    toast({
      title: "Document Added",
      description: "The document has been successfully uploaded.",
    })
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
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      doc.status === "valid"
                        ? "bg-green-100 text-green-700"
                        : doc.status === "expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doc.status}
                  </span>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    View
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

